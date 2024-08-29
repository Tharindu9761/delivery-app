const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const { createDatabase } = require("./config/database");
const { createUserTable } = require("./models/users");
const { createMessageTable } = require("./models/messages");

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors());

// Ensure the database is created before setting up the `users` table
createDatabase()
  .then(() => createUserTable())
  .then(() => createMessageTable())
  .catch((err) => {
    console.error("Error setting up database or tables:", err);
  });

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Start the server, binding to 0.0.0.0 to accept connections from any network interface
app.listen(PORT, "0.0.0.0", () => {
  const host = process.env.HOST || "localhost";
  console.log(`Server is running at http://${host}:${PORT}`);
});
