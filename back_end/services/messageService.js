const pool = require("../config/database");

// Create a new message
const createMessage = async (messageData) => {
  const { name, email, subject, message } = messageData;

  const query = `
    INSERT INTO messages (name, email, subject, message, type)
    VALUES ($1, $2, $3, $4, 'Unread')
    RETURNING *;
  `;

  const values = [name, email, subject, message];

  const res = await pool.query(query, values);
  return res.rows[0];
};

// Get all messages with pagination and optional filtering by type
const getMessages = async ({ page, limit, type }) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT * FROM messages
  `;

  const values = [];

  if (type) {
    query += ` WHERE type = $1`;
    values.push(type);
  }

  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${
    values.length + 2
  }`;

  values.push(limit, offset);

  const res = await pool.query(query, values);
  return res.rows;
};

// Get a message by ID
const getMessageById = async (id) => {
  const query = `SELECT * FROM messages WHERE id = $1`;
  const res = await pool.query(query, [id]);
  return res.rows[0];
};

// Update a message by ID
const updateMessageById = async (id, updateData) => {
  const fields = [];
  const values = [];

  // Iterate over the keys of the updateData object to construct the SQL query
  Object.keys(updateData).forEach((key, index) => {
    fields.push(`${key} = $${index + 1}`);
    values.push(updateData[key]);
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `
      UPDATE messages
      SET ${fields.join(", ")}
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;

  values.push(id);

  const res = await pool.query(query, values);
  return res.rows[0];
};

// Delete a message by ID
const deleteMessageById = async (id) => {
  const query = `DELETE FROM messages WHERE id = $1 RETURNING *`;
  const res = await pool.query(query, [id]);
  return res.rows[0];
};

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
};
