const mongoose = require('mongoose');

/**
 * Schema representing a notification for a user.
 * @typedef {Object} Notification
 * @property {mongoose.Schema.Types.ObjectId} user - The ID of the user to whom the notification belongs.
 * @property {string} message - The content of the notification message.
 * @property {('itemAdded' | 'lowStock' | 'itemRemoved')} type - The type of notification.
 * @property {boolean} read - Indicates whether the notification has been read by the user.
 */

/**
 * Mongoose schema for a notification.
 * @type {mongoose.Schema}
 */
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['itemAdded', 'lowStock', 'itemRemoved'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
