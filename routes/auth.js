const router = require("express").Router();
const { check } = require("express-validator");
const { signup, login, logout } = require("../controllers/authController");

// Signup route
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password should be at least 6 characters long").isLength({ min: 6 }),
  ],
  signup
);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

module.exports = router;
