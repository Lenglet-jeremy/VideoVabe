const express = require('express');
const Video = require('../models/video.shema');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;
    const video = new Video({
      title,
      url: `/uploads/${req.file.filename}`,
      user: req.user.id,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload video', error });
  }
});

router.patch('/:id/like', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.likes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error liking video', error });
  }
});

router.patch('/:id/dislike', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    video.dislikes += 1;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error disliking video', error });
  }
});

module.exports = router;
