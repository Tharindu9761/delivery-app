const pool = require("../config/database");

const createMessageTable = async () => {
  const checkTableQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'messages'
    );
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(10) NOT NULL DEFAULT 'Unread' CHECK (type IN ('Read', 'Unread')),
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
      console.log("Message table created.");
    }
  } catch (err) {
    console.error("Error checking/creating message table:", err);
  }
};

// Export the function so it can be called from elsewhere
module.exports = { createMessageTable };
