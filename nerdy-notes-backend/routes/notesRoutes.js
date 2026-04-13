const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middlewares/authMiddleware");
const Purchase = require("../models/Purchase");
const upload = require("../middlewares/upload");


// Upload notes
const supabase = require("../config/supabase");

router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  async (req, res) => {
    console.log("FILE:", req.file);
console.log("BODY:", req.body);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { title, subject, year, module, type } = req.body;

      // unique file name
      const fileName = `${Date.now()}-${req.file.originalname}`;

      // upload to supabase
   const { data, error } = await supabase.storage
  .from("notes")
  .upload(fileName, req.file.buffer, {
    contentType: req.file.mimetype,
  });

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Upload failed" });
      }

      // get public URL
      const { data: publicUrlData } = supabase.storage
        .from("notes")
        .getPublicUrl(fileName);

      const fileUrl = publicUrlData.publicUrl;

      // save in DB
      const note = new Note({
        title,
        subject,
        year,
        module,
        fileUrl,
        isPremium: type === "premium",
        uploadedBy: req.user.id,
      });

      await note.save();

      res.json({
        message: "Note uploaded successfully",
        note,
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

const https = require("https");


router.get("/download/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const fileUrl = note.fileUrl;

    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer(); // ✅ correct

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.title}.pdf"`
    );

    res.send(Buffer.from(buffer)); // ✅ send as buffer

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/preview/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Extract file path from URL
    const urlParts = note.fileUrl.split("/");
const fileName = urlParts[urlParts.length - 1];


    const { data, error } = await supabase.storage
      .from("notes")
      .createSignedUrl(fileName, 60);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to generate preview" });
    }

    res.json({ url: data.signedUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


