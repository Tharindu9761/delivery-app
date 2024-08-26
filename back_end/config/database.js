// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const defaultPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DEFAULT_DB, // connect to the default database (like postgres)
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createDatabase = async () => {
  try {
    const res = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
    );

    if (res.rowCount === 0) {
      // Database does not exist, create it
      await defaultPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully!`);
    } else {
      // console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
    throw err; // re-throw the error to handle it in the server.js
  } finally {
    defaultPool.end(); // Close the connection to the default database
  }
};

// Create a new pool after the database is ensured to exist
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = {
  createDatabase,
  query: (text, params) => pool.query(text, params),
};
