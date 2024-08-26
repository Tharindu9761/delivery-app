// server.js
const express = require("express");
require("dotenv").config();
const { createDatabase } = require("./config/database");
const { createUserTable } = require("./models/users");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ensure the database is created before creating the `users` table
createDatabase()
  .then(() => {
    return createUserTable();
  })
  .then(() => {})
  .catch((err) => {
    console.error("Error setting up database or user table:", err);
  });

// Use the user routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
