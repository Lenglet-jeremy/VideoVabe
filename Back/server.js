require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos"); // Import du routeur pour la gestion des vidéos

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter); // Monter le routeur pour la gestion des vidéos

// Route pour gérer l'inscription des utilisateurs
app.post('/api/signup', (req, res) => {
  // Logique de traitement de l'inscription
  const { username, email, password } = req.body;

  // Par exemple, vous pouvez ajouter une logique pour enregistrer l'utilisateur dans la base de données ici

  res.status(200).json({
    status: 200,
    message: 'Inscription réussie',
    token: 'token-dummy-value' // Remplacez par un vrai jeton généré
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB connected on port ${port}`);
    });
  })
  .catch((e) => console.error(e));
