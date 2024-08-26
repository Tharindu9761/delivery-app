// services/userService.js
const pool = require('../config/database');

// Create a new user
const createUser = async (user) => {
  const { first_name, last_name, email, password } = user;
  const query = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [first_name, last_name, email, password];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error creating user: ' + err.message);
  }
};

// Get all users
const getAllUsers = async () => {
  const query = 'SELECT * FROM users;';

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error('Error retrieving users: ' + err.message);
  }
};

// Get a user by ID
const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1;';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error retrieving user: ' + err.message);
  }
};

// Update a user by ID
const updateUserById = async (id, user) => {
  const { first_name, last_name, email, password } = user;
  const query = `
    UPDATE users
    SET first_name = $1, last_name = $2, email = $3, password = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [first_name, last_name, email, password, id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error updating user: ' + err.message);
  }
};

// Delete a user by ID
const deleteUserById = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error deleting user: ' + err.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
