const User = require("../models/user.schema");

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


router.get("/verifyMail/:token", verifyMail);

module.exports = router;
