const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema representing a user in the system.
 * @typedef {Object} User
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user (unique).
 * @property {string} password - The hashed password of the user.
 * @property {('storekeeper' | 'salesperson' | 'admin' | 'guest')} role - The role of the user within the system.
 * @property {Object} notificationPreferences - User's preferences for notifications.
 * @property {boolean} notificationPreferences.itemAdded - Preference for notifications on item addition.
 * @property {boolean} notificationPreferences.lowStock - Preference for notifications on low stock.
 * @property {boolean} notificationPreferences.itemRemoved - Preference for notifications on item removal.
 */

/**
 * Mongoose schema for a user.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['storekeeper', 'salesperson', 'admin', 'guest'], 
    default: 'guest',
  }, isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notificationPreferences: {
    itemAdded: { type: Boolean, default: true },
    lowStock: { type: Boolean, default: true },
    itemRemoved: { type: Boolean, default: true },
  },
}, { timestamps: true });

/**
 * Middleware to hash the user's password before saving.
 * @function
 * @param {Function} next - Callback to proceed to the next middleware.
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare entered password with the hashed password.
 * @function
 * @param {string} enteredPassword - The password entered by the user for comparison.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
