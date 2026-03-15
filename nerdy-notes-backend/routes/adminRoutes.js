//routes/adminRoutes.js

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Note = require("../models/Note");
const Purchase = require("../models/Purchase");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");


// GET all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});


// GET all notes
router.get("/notes", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const notes = await Note.find();

    res.json(notes);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes"
    });
  }
});


// GET all purchases
router.get("/purchases", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const purchases = await Purchase.find();

    res.json(purchases);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchases"
    });
  }
});


// DELETE note
router.delete("/notes/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
});

module.exports = router;