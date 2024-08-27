const express = require("express");
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const path = require("path");
const constants = require("../config/const"); 
const router = express.Router();

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
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
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
      return res.status(403).json({ error: "Only Drivers or Customers can log in" });
    }

    const token = jwt.sign({ id: user.id, role: user.user_type }, constants.SECRET_KEY);
    res.status(200).json({ token: token });
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
      return res.status(403).json({ error: "Only Admins or Merchants can log in" });
    }

    const token = jwt.sign({ id: user.id, role: user.user_type }, constants.SECRET_KEY);
    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Serve profile picture thumbnails
router.get("/thumb/:id", async (req, res) => {
  const id = req.params.id;
  let imagePath = path.resolve(path.join(constants.UPLOAD_PROFILE_PIC_THUMB, `${id}.jpg`));

  res.sendFile(imagePath, function (err) {
    if (err) {
      imagePath = path.resolve(path.join(constants.UPLOAD_PROFILE_PIC_THUMB, "user.png"));
      res.sendFile(imagePath, function (err) {
        if (err) {
          console.error("Image not found", { header: req.headers });
          res.status(404).json({ msg: "Image not found" });
        }
      });
    }
  });
});


// Serve full-size profile pictures
router.get("/full/:id", async (req, res) => {
  const id = req.params.id;
  let imagePath = path.resolve(path.join(constants.UPLOAD_PROFILE_PIC_FULL, `${id}.jpg`));

  res.sendFile(imagePath, function (err) {
    if (err) {
      imagePath = path.resolve(path.join(constants.UPLOAD_PROFILE_PIC_FULL, "user.png"));
      res.sendFile(imagePath, function (err) {
        if (err) {
          console.error("Image not found", { header: req.headers });
          res.status(404).json({ msg: "Image not found" });
        }
      });
    }
  });
});

module.exports = router;
