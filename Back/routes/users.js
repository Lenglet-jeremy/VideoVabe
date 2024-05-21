const {
  signupUser,
  verifyMail,
  signinUser,
} = require("../controllers/user-controller");

const router = require("express").Router();

router.post("/signup", signupUser);

router.post("/signin", signinUser);

router.get("/verifyMail/:token", verifyMail);

module.exports = router;
