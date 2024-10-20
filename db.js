// db.js
const mongoose = require("mongoose");

// Define the User schema with email and password fields
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
});

// Create a User model from the schema
const User = mongoose.model("User", userSchema);

module.exports = {
  User, // Export the User model to be used in other parts of the app
};
