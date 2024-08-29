const express = require("express");
const messageService = require("../services/messageService");
const router = express.Router();

// Create a new message
router.post("/", async (req, res) => {
  try {
    const newMessage = await messageService.createMessage(req.body);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages with pagination and optional search by type
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, type } = req.query;

  try {
    const messages = await messageService.getMessages({ page, limit, type });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a message by ID
router.get("/:id", async (req, res) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a message by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMessage = await messageService.updateMessageById(
      req.params.id,
      req.body
    );
    if (updatedMessage) {
      res.status(200).json(updatedMessage);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await messageService.deleteMessageById(req.params.id);
    if (deletedMessage) {
      res.status(200).json(deletedMessage);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
