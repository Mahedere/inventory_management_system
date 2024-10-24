const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRequest } = require('../utils/validation');
const { check } = require('express-validator');

/**
 * @module routes/auth
 */

/**
 * @route POST /register
 * @group auth - User authentication operations
 * @param {string} name.body.required - The name of the user
 * @param {string} email.body.required - The email address of the user
 * @param {string} password.body.required - The password of the user
 * @param {string} role.body.required - The role of the user (storekeeper or salesperson)
 * @returns {object} 201 - The registered user's data with a JWT token
 * @returns {Error}  400 - Bad Request if validation fails
 */
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be either storekeeper or salesperson').isIn(['storekeeper', 'salesperson']),
  validateRequest
], register);

/**
 * @route POST /login
 * @group auth - User authentication operations
 * @param {string} email.body.required - The email address of the user
 * @param {string} password.body.required - The password of the user
 * @returns {object} 200 - The logged-in user's data with a JWT token
 * @returns {Error}  400 - Bad Request if validation fails
 * @returns {Error}  401 - Unauthorized if email or password is incorrect
 */
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validateRequest
], login);

module.exports = router;
