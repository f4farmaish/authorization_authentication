const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "_" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// In-memory notes array
let notes = [];
let idCounter = 1; // simple numeric IDs

// GET /notes
router.get("/notes", (req, res) => {
  res.json(notes);
});

// POST /notes (all fields required)
router.post("/upload", upload.single("attachment"), (req, res) => {
  const { title, content } = req.body;

  if (!title || !content || !req.file) {
    return res.status(400).json({ error: "Title, content, and file are required" });
  }

  const note = {
    id: idCounter++,
    title,
    content,
    attachment: req.file.filename,
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  res.status(201).json(note);
});

// DELETE /notes/:id
router.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  const deletedNote = notes.splice(index, 1)[0];

  // Delete file
  const filePath = path.join(__dirname, "..", "uploads", deletedNote.attachment);
  fs.unlink(filePath, (err) => {
    if (err) console.error("File deletion error:", err);
  });

  res.json({ message: "Note deleted", id: deletedNote.id });
});

module.exports = router;
