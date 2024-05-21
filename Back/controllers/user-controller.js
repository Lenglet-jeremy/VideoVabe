const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalideToken,
} = require("../email/email");

const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "60s" });
};

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const token = createTokenEmail(email);
      console.log(token);
      await sendConfirmationEmail(email, token);
      const salt = await bcrypt.genSalt(10);
      const hashpwd = await bcrypt.hash(password, salt);
      const user = new User({
        username,
        email,
        password: hashpwd,
        token,
      });
      await user.save();
      res.status(200).json({
        message:
          "Veuillez confirmer votre inscription en consultant votre boite mail",
        status: 200,
      });
    } else {
      res.status(400).json({ message: "Compte déjà existant.", status: 400 });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

const verifyMail = async (req, res) => {
  const token = req.params.token;
  const isTokenNull = await User.findOne({ token: token });
  const decoded = jwt.verify(token, process.env.SECRET, {
    ignoreExpiration: true,
  });
  console.log(decoded);
  try {
    if (!isTokenNull) {
      res.status(400).json({ message: "Token déjà validé.", status: 400 });
      return;
    }
    if (decoded.exp * 1000 > new Date().getTime()) {
      //Token encore valide
      await User.findOneAndUpdate({ email: decoded.email }, { token: null });
      await sendValidationAccount(decoded.email);
      res.json({ message: "Inscription confirmée avec succès", status: 200 });
    } else {
      await User.findOneAndDelete({ email: decoded.email });
      await sendInvalideToken(decoded.email);
      res
        .status(400)
        .json({ message: "Token non valide ou expiré", status: 400 });
    }
  } catch (error) {
    console.error(error);
  }
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.token) {
        res.status(400).json({
          message: "Compte non validé.",
          status: 400,
        });
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ user, status: 200 });
      } else {
        res.status(400).json({
          message: "Combinaison email/mot de passe incorrect.",
          status: 400,
        });
      }
    } else {
      res.status(400).json({
        message: "Combinaison email/mot de passe incorrect.",
        status: 400,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error);
  }
};

module.exports = { signupUser, verifyMail, signinUser };
