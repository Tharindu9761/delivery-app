const pool = require("../config/database");

const createUserTable = async () => {
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'users'
    );
  `;

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      contact_no VARCHAR(15),
      no VARCHAR(50),
      suburb VARCHAR(10),
      postal_code VARCHAR(10), 
      state VARCHAR(10),
      user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('Admin', 'Customer', 'Driver', 'Merchant')),
      status VARCHAR(20) CHECK (status IN ('Pending', 'Approved', 'Rejected')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

  try {
    // Check if the table exists
    const res = await pool.query(checkTableQuery);
    const tableExists = res.rows[0].exists;

    if (!tableExists) {
      // Create the table if it doesn't exist
      await pool.query(createTableQuery);
      console.log("User table created.");
    }
  } catch (err) {
    console.error("Error checking/creating user table:", err);
  }
};

// Export the function so it can be called from elsewhere
module.exports = { createUserTable };
