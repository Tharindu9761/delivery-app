const pool = require("../config/database");
const emailService = require("./emailService");
const jwt = require("jsonwebtoken");
const constants = require("../config/const");
require("dotenv").config();

// Helper function to exclude the password from the user object
const excludePassword = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Create a new user
const createUser = async (user) => {
  const {
    first_name,
    last_name,
    email,
    password,
    user_type,
    contact_no,
    no,
    street_name,
    suburb,
    postal_code,
    state,
    status,
  } = user;

  const query = `
    INSERT INTO users (
      first_name, last_name, email, password, user_type, contact_no, no, street_name, suburb, postal_code, state, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;

  const values = [
    first_name,
    last_name,
    email,
    password,
    user_type,
    contact_no,
    no,
    street_name,
    suburb,
    postal_code,
    state,
    status,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error("Error creating user: " + err.message);
  }
};

// Get all users
const getAllUsers = async ({ page = 1, limit = 10, user_type, status }) => {
  const offset = (page - 1) * limit;
  let query = `SELECT * FROM users`;
  let countQuery = `SELECT COUNT(*) FROM users`;

  const values = [];
  let conditions = [];

  // Add conditions based on the presence of status and user_type
  if (status) {
    conditions.push(`status = $${conditions.length + 1}`);
    values.push(status);
  }

  if (user_type) {
    conditions.push(`user_type = $${conditions.length + 1}`);
    values.push(user_type);
  }

  if (conditions.length > 0) {
    const conditionString = conditions.join(" AND ");
    query += ` WHERE ${conditionString}`;
    countQuery += ` WHERE ${conditionString}`;
  }

  query += ` ORDER BY created_at ASC LIMIT $${values.length + 1} OFFSET $${
    values.length + 2
  }`;

  values.push(limit, offset);

  try {
    // Perform the queries concurrently
    const [userResult, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, values.slice(0, conditions.length)),
    ]);

    const data = userResult.rows.map(excludePassword);
    const total = parseInt(countResult.rows[0].count, 10);

    return { data, total };
  } catch (err) {
    console.error("Error fetching users:", err);
    return { data: [], total: 0 };
  }
};

// Get a user by ID
const getUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1;";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return excludePassword(result.rows[0]);
  } catch (err) {
    throw new Error("Error retrieving user: " + err.message);
  }
};

// Update a user by ID
const updateUserById = async (id, user) => {
  const fields = [];
  const values = [];
  let query = "UPDATE users SET ";

  Object.entries(user).forEach(([key, value], index) => {
    if (value !== undefined && value !== null) {
      fields.push(`${key} = $${index + 1}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  query += fields.join(", ");
  query += " WHERE id = $" + (values.length + 1) + " RETURNING *;";
  values.push(id);

  try {
    const result = await pool.query(query, values);
    return excludePassword(result.rows[0]);
  } catch (err) {
    throw new Error("Error updating user: " + err.message);
  }
};

// Delete a user by ID
const deleteUserById = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING *;";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return excludePassword(result.rows[0]);
  } catch (err) {
    throw new Error("Error deleting user: " + err.message);
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1;";
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error("Error retrieving user by email: " + err.message);
  }
};

// Reset a user's password by ID
const resetPasswordById = async (id, newPassword) => {
  const query = "UPDATE users SET password = $1 WHERE id = $2 RETURNING *;";
  const values = [newPassword, id];

  try {
    const result = await pool.query(query, values);
    return excludePassword(result.rows[0]);
  } catch (err) {
    throw new Error("Error resetting password: " + err.message);
  }
};

// Reset a user's password by Email
const resetPasswordByEmail = async (email, newPassword) => {
  const query = "UPDATE users SET password = $1 WHERE email = $2 RETURNING *;";
  const values = [newPassword, email];

  try {
    const result = await pool.query(query, values);
    return excludePassword(result.rows[0]);
  } catch (err) {
    throw new Error("Error resetting password: " + err.message);
  }
};

const sendPasswordResetLink = async (email, type) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (type === "App") {
      if (user.user_type !== "Admin" && user.user_type !== "Merchant") {
        return {
          success: false,
          message: "User is not of type Admin or Merchant",
        };
      }
    }

    if (type === "Mobile") {
      if (user.user_type !== "Customer" && user.user_type !== "Driver") {
        return {
          success: false,
          message: "User is not of type Customer or Driver",
        };
      }
    }

    const token = jwt.sign({ email: user.email }, constants.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Adjusted link for React web app running on localhost
    const resetLink =
      type === "App"
        ? `${process.env.RESET_LINK_WEB}?token=${token}` // for web app
        : `${process.env.RESET_LINK_MOBILE}?token=${token}`; // mobile app link

    const emailData = {
      email: user.email,
      subject: "Quick Drop Password Reset Request",
      text: `Please click the link to reset your password: ${resetLink}`,
      html: `<p>Please click the link below to reset your password: Link will expire after 1 hour</p><a href="${resetLink}">${resetLink}</a>`,
    };

    const emailResponse = await emailService.sendEmail(emailData);

    if (emailResponse.success) {
      return {
        success: true,
        message: "Password reset link sent successfully",
      };
    } else {
      return { success: false, message: "Failed to send password reset link" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error sending reset link: " + error.message,
    };
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  resetPasswordById,
  resetPasswordByEmail,
  sendPasswordResetLink,
};
