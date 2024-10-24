const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

/**
 * Route for user signup
 * Validates email and password, checks for existing users, hashes password, and adds the user to the database.
 *
 * @route POST /signup
 */
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please provide a password that is greater than 5 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { email, password, role } = req.body;

    // Validates the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user already exists in the database
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user and save to database
      user = new User({ email, password: hashedPassword, role });
      await user.save();

      // Generate a JWT token
      const token = await JWT.sign({ email, role }, "sryucgkjlkjjdxfcvgljjgfdxykxfy", { expiresIn: 5000 });

      res.json({ token, message: "User successfully signed up" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * Route for user login.
 * Checks if the user exists, verifies the password, and returns a JWT token upon successful authentication.
 *
 * @route POST /login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // Generate JWT token
    const token = await JWT.sign({ email: user.email, role: user.role }, "sryucgkjlkjjdxfcvgljjgfdxykxfy", {
      expiresIn: 5000,
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
