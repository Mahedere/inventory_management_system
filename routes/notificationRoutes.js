const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');

router.get('/', protect, getUserNotifications);
router.patch('/:id/read', protect, markNotificationAsRead);

module.exports = router;
