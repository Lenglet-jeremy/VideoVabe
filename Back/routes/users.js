//ROUTES/USERS.JS
// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.schema");
const Video = require("../models/video.shema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to upload a video
router.post("/videos/upload", authenticateToken, upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;
    const video = new Video({
      title,
      url: `/uploads/${req.file.filename}`,
      user: req.user.id
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

// Route to get all videos
router.get("/videos", authenticateToken, async (req, res) => {
  try {
    const videos = await Video.find().populate('user', 'username');
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

// Route to like a video
router.post("/videos/:id/like", authenticateToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    video.likes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

// Route to dislike a video
router.post("/videos/:id/dislike", authenticateToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    video.dislikes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

module.exports = router;
