const Item = require("../models/Item");
const User = require("../models/User");
const Notification = require("../models/Notification");

/**
 * Creates a new inventory item and sends notifications to users who have opted in for item addition notifications.
 * @async
 * @function createItem
 * @param {Object} req - Express request object containing the item details.
 * @param {Object} req.body - Request body containing the item's name, description, model, category, quantity, and maxLimit.
 * @param {Object} req.user - The authenticated user adding the item.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with the created item or an error message.
 */
const createItem = async (req, res) => {
  try {
    const { name, description, model, category, quantity, maxLimit ,price} = req.body;

    const item = await Item.create({
      name,
      description,
      model,
      category,
      quantity,
      maxLimit,
      price,
      addedBy: req.user._id,
      lastUpdatedBy: req.user._id,
    });

    // Create notifications
    const users = await User.find({
      "notificationPreferences.itemAdded": true,
    });
    await Notification.insertMany(
      users.map((user) => ({
        user: user._id,
        message: `New item ${name} has been added to inventory by ${item.addedBy.name}`,
        type: "itemAdded",
      }))
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Updates the quantity of an inventory item and sends low stock alerts if the quantity is below 20% of the max limit.
 * @async
 * @function updateItemQuantity
 * @param {Object} req - Express request object containing the updated quantity.
 * @param {Object} req.body - Request body containing the new quantity value.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with the updated item or an error message.
 */
const updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    if (quantity > item.maxLimit) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds maximum limit" });
    }

    item.quantity = quantity;
    item.lastUpdatedBy = req.user._id;
    await item.save();

    if (quantity < item.maxLimit * 0.2) {
      const users = await User.find({
        "notificationPreferences.lowStock": true,
      });
      await Notification.insertMany(
        users.map((user) => ({
          user: user._id,
          message: `Low stock alert for ${item.name}`,
          type: "lowStock",
        }))
      );
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Retrieves a list of inventory items based on optional filters for name, category, and model.
 * @async
 * @function getItems
 * @param {Object} req - Express request object containing the query filters.
 * @param {Object} req.query - Query parameters for filtering items by name, category, or model.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with a list of filtered items or an error message.
 */
const getItems = async (req, res) => {
  try {
    const { name, category, model } = req.query;
    const filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (category) filter.category = new RegExp(category, "i");
    if (model) filter.model = new RegExp(model, "i");

    const items = await Item.find(filter).populate("lastUpdatedBy", "name");
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Deletes an inventory item and sends notifications to users who have opted in for item removal notifications.
 * @async
 * @function deleteItem
 * @param {Object} req - Express request object containing the item ID.
 * @param {Object} res - Express response object used to send a response back to the client.
 * @returns {Promise<void>} Responds with a success message or an error message.
 */
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.remove();

    // Create notifications
    const users = await User.find({
      "notificationPreferences.itemRemoved": true,
    });
    await Notification.insertMany(
      users.map((user) => ({
        user: user._id,
        message: `Item ${item.name} has been removed from inventory`,
        type: "itemRemoved",
      }))
    );

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  updateItemQuantity,
  getItems,
  deleteItem,
};
