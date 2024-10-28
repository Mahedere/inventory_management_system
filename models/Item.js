const mongoose = require("mongoose");

/**
 * Schema representing an item in the inventory.
 * @typedef {Object} Item
 * @property {string} name - The name of the item.
 * @property {string} description - A description of the item.
 * @property {string} model - The model identifier of the item.
 * @property {string} category - The category to which the item belongs.
 * @property {number} quantity - The current quantity of the item in stock (must be non-negative).
 * @property {number} maxLimit - The maximum quantity allowed for the item.
 * @property {mongoose.Schema.Types.ObjectId} lastUpdatedBy - The ID of the user who last updated the item.
 */

/**
 * Mongoose schema for an inventory item.
 * @type {mongoose.Schema}
 */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    maxLimit: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
