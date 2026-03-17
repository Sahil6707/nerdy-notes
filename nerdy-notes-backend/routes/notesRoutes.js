const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middlewares/authMiddleware");
const Purchase = require("../models/Purchase");
const upload = require("../middlewares/upload");

const fs = require("fs");
const path = require("path");

console.log("notesRoutes loaded");

// Upload notes
router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  async (req, res) => {
    console.log("FILE DEBUG:", req.file);
    try {

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const { title, subject, year, module, type } = req.body;
      const fileUrl = req.file.path;
      const note = new Note({
        title,
        subject,
        fileUrl,
        year,
        module,
        isPremium: type === "premium",
        uploadedBy: req.user.id
      });
      await note.save();
      res.json({
        message: "Note uploaded successfully",
        note
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/premium", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ isPremium: true });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch premium notes",
    });
  }
});

router.get("/premium/:noteId", authMiddleware, async (req, res) => {
  try {
    const { noteId } = req.params;

    const purchase = await Purchase.findOne({
      user: req.user.id,
      note: noteId,
    });

    if (!purchase) {
      return res.status(403).json({
        message: "You need to purchase this note first",
      });
    }

    const note = await Note.findById(noteId);

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const subject = req.query.subject;

    const filter = {};

    if (subject) {
      filter.subject = subject;
    }

    const notes = await Note.find(filter).sort({ module: 1 });

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

router.get("/hello", (req, res) => {
  res.send("Notes route working");
});
// Delete note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: "Note deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
