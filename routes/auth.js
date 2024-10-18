const router = require("express").Router(); // Import Express Router to handle routes
const { check, validationResult } = require("express-validator"); // Import express-validator for validation
const { users } = require("../db"); // Import the users array or database model from a separate file
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const JWT = require("jsonwebtoken");
/**
 * Route for user signup
 * Validates email and password, checks for existing users, hashes password, and adds the user to the database.
 *
 * @route POST /signup
 * @param {string} email - User's email (validated for correct email format).
 * @param {string} password - User's password (validated for minimum length of 6 characters).
 */
router.post(
  "/signup",
  [
    // Validate email to ensure it's a valid email format
    check("email", "Please provide a valid email").isEmail(),
    // Validate password to ensure it has a minimum length of 6 characters
    check(
      "password",
      "Please provide a password that is greater than 5 characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;

    // Validates the input and checks for any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(), // Returns the list of validation errors
      });
    }

    // Checks if the user already exists in the database
    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This user already exists", // Error message if the user already exists
          },
        ],
      });
    }

    // Hashes the password using bcrypt with a salt factor of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create JWT token
    const token = await JWT.sign(
      { email },
      "sryucgkjlkjjdxfcvgljjgfdxykxfy", // secret key
      {
        expiresIn: 5000,
      }
    );

    // Adds the new user to the users array (or database)
    users.push({
      email,
      password: hashedPassword,
    });

    // Send token and success message
    return res.json({
      token,
      message: "User successfully signed up",
    });
  }
);

/**
 * Route to log in a user.
 * Checks if the user exists, verifies the password, and returns a JWT token upon successful authentication.
 *
 * @route POST /login
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {object} JWT token if login is successful, or an error message for invalid credentials.
 */
router.post("/login", async (req, res) => {
  const { password, email } = req.body; // Extract email and password from request

  // Find user by email
  let user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] }); // User not found
  }

  // Compare passwords
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] }); // Password mismatch
  }

  // Generate JWT token with a secret key and expiration
  const token = await JWT.sign({ email }, "secretKey", { expiresIn: 5000 });

  // Send token response
  res.json({ token });
});

/**
 * Route to retrieve all users (for testing purposes or admin access).
 * Returns the list of all users from the database.
 *
 * @route GET /all
 */
router.get("/all", (req, res) => {
  res.json(users); // Returns the entire users array as a JSON response
});

module.exports = router; // Exports the router to be used in other parts of the application
