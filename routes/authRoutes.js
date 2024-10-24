const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRequest } = require('../utils/validation');
const { check } = require('express-validator');

router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be either storekeeper or salesperson').isIn(['storekeeper', 'salesperson']),
  validateRequest
], register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validateRequest
], login);

module.exports = router;
