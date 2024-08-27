const express = require("express");
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.user_type !== "Driver" && user.user_type !== "Customer") {
      return res
        .status(403)
        .json({ error: "Only Drivers or Customers can log in" });
    }

    const token = jwt.sign(user, process.env.SECRET_KEY);
    res.status(200).json({ token: token, key: process.env.SECRET_KEY });
  } catch (err) {
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
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.user_type !== "Admin" && user.user_type !== "Merchant") {
      return res
        .status(403)
        .json({ error: "Only Admins or Merchants can log in" });
    }

    const token = jwt.sign(user, process.env.SECRET_KEY);
    res.status(200).json({ token: token, key: process.env.SECRET_KEY });
  } catch (err) {
    res.status(500).json({ error: "An error occurred during login" });
  }
});

module.exports = router;
