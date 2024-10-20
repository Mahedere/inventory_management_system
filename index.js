const express = require("express");
const auth = require("./routes/auth"); // Import the auth routes
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection function
const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Call the database connection function
connectToDB();

// Use the auth routes
app.use("/auth", auth);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
