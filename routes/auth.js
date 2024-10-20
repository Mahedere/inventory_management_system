const router = require("express").Router(); // Import Express Router
const { check, validationResult } = require("express-validator"); // Import express-validator
const { User } = require("../db"); // Import the User model from db.js
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const JWT = require("jsonwebtoken");

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
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          errors: [{ msg: "User already exists" }],
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user and save to the database
      const newUser = new User({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      // Create JWT token
      const token = await JWT.sign({ email }, "sdgsgremk3242fsvdsvdfv", {
        expiresIn: 5000,
      });

      return res.json({ token, message: "User successfully signed up" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * Route to log in a user.
 * Verifies the email and password, and returns a JWT token if valid.
 *
 * @route POST /login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // Create JWT token
    const token = await JWT.sign({ email }, "sdgsgremk3242fsvdsvdfv", {
      expiresIn: 5000,
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * Route to retrieve all users (for testing or admin access).
 *
 * @route GET /all
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
