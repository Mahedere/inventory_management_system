const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to protect routes by verifying JWT token and attaching user to req object
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the 'Authorization' header
      token = req.headers.authorization.split(' ')[1]; 

      // Verify the token using your secret key (ensure JWT_SECRET is in your environment variables)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user information to the request object (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user has admin role
const admin = (req, res, next) => {
  // Check if the user object exists and if the user has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, continue to the next handler
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' }); // Return error if user is not an admin
  }
};

module.exports = { protect, admin };
