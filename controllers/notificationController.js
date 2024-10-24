const Notification = require('../models/Notification');

/**
 * Retrieves all notifications for the authenticated user, sorted by creation date.
 * @async
 * @function getUserNotifications
 * @param {Object} req - Express request object containing the authenticated user.
 * @param {Object} req.user - The authenticated user.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with a list of notifications or an error message.
 */
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Marks a notification as read by its ID, ensuring the authenticated user is the owner of the notification.
 * @async
 * @function markNotificationAsRead
 * @param {Object} req - Express request object containing the notification ID and authenticated user.
 * @param {Object} req.params - Request parameters containing the notification ID.
 * @param {Object} req.user - The authenticated user.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with the updated notification or an error message.
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
};
