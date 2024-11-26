const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort('-createdAt');
  res.json(users);
});

// @desc    Get guest users
// @route   GET /api/users/guest
// @access  Private/Admin
const getGuestUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'guest' })
    .select('-password')
    .sort('-createdAt');
  res.json(users);
});

// @desc    Assign role to user
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const assignRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  // Validate role
  if (!['storekeeper', 'salesperson'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update user role
  user.role = role;
  await user.save();

  res.json(user);
});

// @desc    Toggle user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Can't deactivate admin
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot deactivate admin user');
  }

  user.isActive = isActive;
  await user.save();

  res.json(user);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        storekeepers: {
          $sum: { $cond: [{ $eq: ['$role', 'storekeeper'] }, 1, 0] }
        },
        salespersons: {
          $sum: { $cond: [{ $eq: ['$role', 'salesperson'] }, 1, 0] }
        },
        guestUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'guest'] }, 1, 0] }
        }
      }
    }
  ]);

  res.json(stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    storekeepers: 0,
    salespersons: 0,
    guestUsers: 0
  });
});

// Export all functions at once
module.exports = {
  getUsers,
  getGuestUsers,
  assignRole,
  toggleUserStatus,
  getUserById,
  getUserStats,
};
