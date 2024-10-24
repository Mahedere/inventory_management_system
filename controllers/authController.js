const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generates a JWT token for a given user ID.
 * @function
 * @param {string} id - The user ID to include in the JWT payload.
 * @returns {string} The generated JWT token.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Registers a new user in the system.
 * @async
 * @function
 * @param {Object} req - Express request object containing the user's registration data.
 * @param {Object} req.body - Request body containing the user's details (name, email, password, role).
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with the created user data and token, or an error message.
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Logs a user into the system by validating their credentials.
 * @async
 * @function
 * @param {Object} req - Express request object containing the user's login data.
 * @param {Object} req.body - Request body containing the user's email and password.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with the user's data and token if successful, or an error message if authentication fails.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
