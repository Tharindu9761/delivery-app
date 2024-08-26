const express = require("express");
require("dotenv").config();
const { createDatabase } = require("./config/database");
const { createUserTable } = require("./models/users");
const cors = require('cors');


const userRoutes = require("./routes/userRoutes");


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ensure the database is created before creating the `users` table
createDatabase()
  .then(() => {
    return createUserTable();
  })
  .then(() => {
  })
  .catch((err) => {
    console.error("Error setting up database or user table:", err);
  });

// Use the user routes
app.use("/api/users", userRoutes);

// Bind the server to 0.0.0.0 to accept connections from any network interface
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
