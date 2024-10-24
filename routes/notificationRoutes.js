const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');

/**
 * @module routes/notification
 */

/**
 * @route GET /
 * @group notification - Notification operations
 * @security JWT
 * @returns {Array.<Notification>} 200 - An array of user notifications
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
router.get('/', protect, getUserNotifications);

/**
 * @route PATCH /:id/read
 * @group notification - Notification operations
 * @security JWT
 * @param {string} id.path.required - The ID of the notification to mark as read
 * @returns {object} 200 - The updated notification data
 * @returns {Error}  404 - Not Found if the notification does not exist
 * @returns {Error}  403 - Forbidden if the user is not authorized to mark the notification
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
router.patch('/:id/read', protect, markNotificationAsRead);

module.exports = router;
