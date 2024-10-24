const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
  
  const register = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
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
  
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
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