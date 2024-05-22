const User = require("../models/user.schema");
const express = require("express");
const jwt = require("jsonwebtoken");

const {
  signupUser,
  verifyMail,
  signinUser,
} = require("../controllers/user-controller");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Pseudo déjà utilisé" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }
    res.status(200).json({ message: "Connexion réussie", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur", error });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/verifyMail/:token", verifyMail);

module.exports = router;
