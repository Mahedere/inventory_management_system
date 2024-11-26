const express = require('express');
const router = express.Router();

// Middleware
const { protect, admin } = require('../middleware/admin');

// Controller Functions
const {
    getUsers,
    getGuestUsers,
    getUserStats,
    getUserById,
    assignRole,
    toggleUserStatus,
  } = require('../controllers/userController');
  


// Apply middleware to all routes
router.use(protect, admin);
// Route: Fetch all users
router.get('/', getUsers);

// Route: Fetch all guest users
router.get('/guest', getGuestUsers);

// Route: Fetch user statistics
router.get('/stats', getUserStats);

// Route: Fetch a single user by ID
router.get('/:id', getUserById);

// Route: Assign a role to a user
router.patch('/:id/role', assignRole);

// Route: Toggle user active/inactive status
router.patch('/:id/status', toggleUserStatus);

module.exports = router;
