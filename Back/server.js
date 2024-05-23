require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.schema");  
const port = process.env.PORT || 4000;
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter); 

// Route pour l'inscription
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({
      status: 201,
      message: 'Inscription réussie',
      token: 'token-dummy-value'  
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        status: 400,
        message: 'Email ou username déjà utilisé'
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Erreur lors de l\'inscription. Veuillez réessayer.',
        error: error.message
      });
    }
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB connected on port ${port}`);
    });
  })
  .catch((e) => console.error(e));
