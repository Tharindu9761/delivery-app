const express = require("express");
require("dotenv").config();
const { createDatabase } = require("./config/database");
const { createUserTable } = require("./models/users");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors());

// Ensure the database is created before setting up the `users` table
createDatabase()
  .then(() => {
    return createUserTable();
  })
  .catch((err) => {
    console.error("Error setting up database or user table:", err);
  });

// Register routes
app.use("/api/users", userRoutes);

// Start the server, binding to 0.0.0.0 to accept connections from any network interface
app.listen(PORT, '0.0.0.0', () => {
  const host = process.env.HOST || 'localhost';
  console.log(`Server is running at http://${host}:${PORT}`);
});
