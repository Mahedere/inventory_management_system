const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    enum: ["storekeeper", "salesperson"], // Restricts the role to specific values
    required: true, // Ensure that the role is provided
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
