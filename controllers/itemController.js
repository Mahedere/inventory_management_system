const Item = require("../models/Item");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createItem = async (req, res) => {
  try {
    const { name, description, model, category, quantity, maxLimit } = req.body;

    const item = await Item.create({
      name,
      description,
      model,
      category,
      quantity,
      maxLimit,
      lastUpdatedBy: req.user._id,
    });

    // Create notifications
    const users = await User.find({
      "notificationPreferences.itemAdded": true,
    });
    await Notification.insertMany(
      users.map((user) => ({
        user: user._id,
        message: `New item ${name} has been added to inventory`,
        type: "itemAdded",
      }))
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
