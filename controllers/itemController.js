const Item = require("../models/Item");
const User = require("../models/User");
const Notification = require("../models/Notification");

/**
 * Creates a new inventory item and sends notifications to users who have opted in for item addition notifications.
 * @async
 * @function createItem
 */
const createItem = async (req, res) => {
  try {
    const { name, description, model, category, quantity, maxLimit, price } = req.body;

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

/**
 * Updates all fields of an item by its ID.
 * @async
 * @function updateItem
 */
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate item existence
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update fields
    const allowedUpdates = ["name", "description", "model", "category", "quantity", "maxLimit", "price"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    updates.forEach((update) => (item[update] = req.body[update]));
    item.lastUpdatedBy = req.user._id; // Track updater
    await item.save();

    res.json(item); // Return updated item
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createItem,
  updateItemQuantity,
  getItems,
  deleteItem,
  updateItem, 
};
