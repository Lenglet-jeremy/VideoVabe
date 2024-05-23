require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  res.status(200).json({
    status: 200,
    message: 'Inscription réussie',
    token: 'token-dummy-value'
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
