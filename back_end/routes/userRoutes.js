const express = require("express");
const userService = require("../services/userService");
const emailService = require("../services/emailService");
const jwt = require("jsonwebtoken");
const path = require("path");
const constants = require("../config/const");
const router = express.Router();
const { pool } = require("../config/database");
require("dotenv").config();

// Create a new user
router.post("/", async (req, res) => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query("BEGIN"); // Start a transaction

    // Create a new user and insert into the database
    const newUser = await userService.createUser(req.body, client); // Pass the client to `createUser`

    // Prepare the email data
    const emailData = {
      email: newUser.email,
      subject: "Welcome to Quick Drop - Your Account Details",
      text: `Dear ${newUser.first_name},\n\nYour account has been successfully created. Here are your account details:\n\nEmail: ${newUser.email}\nPassword: ${newUser.password}\n\nPlease keep this information safe.\n\nYou can sign in here: ${process.env.SIGNIN_LINK_WEB}\n\nThank you for choosing Quick Drop!`,
      html: `<p>Dear ${newUser.first_name},</p>
             <p>Your account has been successfully created. Here are your account details:</p>
             <p><strong>Email:</strong> ${newUser.email}</p>
             <p><strong>Password:</strong> ${newUser.password}</p>
             <p>Please keep this information safe.</p>
             <p>You can <a href="${process.env.SIGNIN_LINK_WEB}">sign in here</a>.</p>
             <p>Thank you for choosing Quick Drop!</p>`,
    };

    // Send the email
    const emailResponse = await emailService.sendEmail(emailData);

    // Check if email was sent successfully
    if (!emailResponse.success) {
      throw {
        status: 500,
        message: "Email sending failed: " + emailResponse.message,
      };
    }

    // If both user creation and email sending succeed, commit the transaction
    await client.query("COMMIT");

    // Send a success response
    res.status(200).json({
      success: true,
      message: "User created successfully, email sent",
    });
  } catch (err) {
    // If an error occurs, rollback the transaction
    await client.query("ROLLBACK");

    // Send structured error response
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "An unexpected error occurred",
    });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

// Get all users
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, status, user_type } = req.query;

  try {
    // Pass user_type and status to the service function
    const users = await userService.getAllUsers({
      page,
      limit,
      user_type,
      status,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(
      req.params.id,
      req.body
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (deletedUser) {
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mobile Login route for Driver and Customer
router.post("/mobile_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.user_type !== "Driver" && user.user_type !== "Customer") {
      return res
        .status(403)
        .json({ error: "Only Drivers or Customers can log in" });
    }

    if (user.user_type == "Driver" && user.status !== "Approved") {
      return res.status(403).json({
        error: "Account is not approved yet. Please contact support.",
      });
    }

    const token = jwt.sign(user, constants.SECRET_KEY);

    res.status(200).json({ token, key: constants.SECRET_KEY });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Admin and Merchant Login route
router.post("/web_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.user_type !== "Admin" && user.user_type !== "Merchant") {
      return res
        .status(403)
        .json({ error: "Only Admins or Merchants can log in" });
    }

    if (user.user_type == "Merchant" && user.status !== "Approved") {
      return res.status(403).json({
        error: "Account is not approved yet. Please contact support.",
      });
    }
    const token = jwt.sign(user, constants.SECRET_KEY);

    res.status(200).json({ token, key: constants.SECRET_KEY });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Serve profile picture thumbnails
router.get("/thumb/:id", async (req, res) => {
  const id = req.params.id;

  let imagePath = path.resolve(
    path.join(constants.UPLOAD_PROFILE_PIC_THUMB, `${id}.png`)
  );

  res.sendFile(imagePath, function (err) {
    if (err) {
      imagePath = path.resolve(
        path.join(constants.UPLOAD_PROFILE_PIC_THUMB, "user.png")
      );
      res.sendFile(imagePath, function (err) {
        if (err) {
          console.error("Image not found", { header: req.headers });
          res.status(404).json({ msg: "Image not found" });
        }
      });
    }
  });
});

// Serve full-size profile pictures
router.get("/full/:id", async (req, res) => {
  const id = req.params.id;
  let imagePath = path.resolve(
    path.join(constants.UPLOAD_PROFILE_PIC_FULL, `${id}.png`)
  );

  res.sendFile(imagePath, function (err) {
    if (err) {
      imagePath = path.resolve(
        path.join(constants.UPLOAD_PROFILE_PIC_FULL, "user.png")
      );
      res.sendFile(imagePath, function (err) {
        if (err) {
          console.error("Image not found", { header: req.headers });
          res.status(404).json({ msg: "Image not found" });
        }
      });
    }
  });
});

// Reset a user's password by ID
// Helper function to send a password reset email
const sendPasswordResetEmail = async (user) => {
  const emailData = {
    email: user.email,
    subject: "Quick Drop - Password Successfully Reset",
    text: `Dear ${user.first_name},\n\nYour password has been successfully reset. You can now sign in using your new password.\n\nIf you did not request this change, please contact our support immediately.\n\nYou can sign in here: ${process.env.SIGNIN_LINK_WEB}\n\nThank you for choosing Quick Drop!`,
    html: `<p>Dear ${user.first_name},</p>
           <p>Your password has been successfully reset. You can now sign in using your new password.</p>
           <p>If you did not request this change, please contact our support immediately.</p>
           <p>You can <a href="${process.env.SIGNIN_LINK_WEB}">sign in here</a>.</p>
           <p>Thank you for choosing Quick Drop!</p>`,
  };

  const emailResponse = await emailService.sendEmail(emailData);
  if (!emailResponse.success) {
    throw {
      status: 500,
      message: "Email sending failed: " + emailResponse.message,
    };
  }
};

// Helper function to handle password reset
const resetPassword = async (
  userIdOrEmail,
  newPassword,
  client,
  resetByEmail
) => {
  const user = resetByEmail
    ? await userService.getUserByEmail(userIdOrEmail, client)
    : await userService.getUserById(userIdOrEmail, client);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const updatedUser = resetByEmail
    ? await userService.resetPasswordByEmail(userIdOrEmail, newPassword, client)
    : await userService.resetPasswordById(userIdOrEmail, newPassword, client);

  if (!updatedUser) {
    throw { status: 404, message: "User not found" };
  }

  await sendPasswordResetEmail(user);
};

// Route to reset password by user ID
router.put("/reset_password_id/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const client = await pool.connect(); // Ensure you are using a connection from the pool

  try {
    await client.query("BEGIN"); // Begin transaction

    // Reset the user's password and send the email
    await resetPassword(id, newPassword, client, false);

    await client.query("COMMIT"); // Commit transaction if all operations succeed
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    const statusCode = err.status || 500;
    res
      .status(statusCode)
      .json({ error: "Error resetting password: " + err.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

// Route to reset password by email
router.put("/reset_password_email/:email", async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const client = await pool.connect(); // Get a client connection from the pool

  try {
    await client.query("BEGIN"); // Start transaction

    // Reset the user's password and send the email (using email instead of ID)
    await resetPassword(email, newPassword, client, true);

    await client.query("COMMIT"); // Commit transaction if all operations succeed
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    const statusCode = err.status || 500;
    res
      .status(statusCode)
      .json({ error: "Error resetting password: " + err.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

router.post("/send_reset_link", async (req, res) => {
  const { email, type } = req.body;

  try {
    const result = await userService.sendPasswordResetLink(email, type);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

// Route to get total approved counts
router.get("/counts", async (req, res) => {
  try {
    const counts = await userService.getTotalApprovedCounts();
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching total approved counts" });
  }
});

// Route to get approved counts in the last 6 months
router.get("/counts_month", async (req, res) => {
  const { months } = req.query;

  if (!months || isNaN(months)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing months parameter" });
  }

  try {
    const counts = await userService.getApprovedCountWithMonths(
      parseInt(months)
    );
    res.status(200).json(counts);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching approved counts for months" });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update user status by ID
router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // List of allowed statuses
  const allowedStatuses = ["Pending", "Approved", "Rejected", "Inactive"];

  // Check if the status is valid
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // Update the user's status in the database
    const updatedUser = await userService.updateUserStatusById(id, status);
    if (updatedUser) {
      res.status(200).json({ success: true, message: "Status updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating user status: " + err.message });
  }
});



module.exports = router;
