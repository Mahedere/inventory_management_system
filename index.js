const express = require("express");
const authRoutes = require("./routes/auth");
const connectToDB = require("./config/db");
const bodyParser = require("body-parser");

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
connectToDB();

// Routes
app.use("/auth", authRoutes);

// Main route
app.get("/", (req, res) => {
  res.send("Hi, I am working");
});

// Server listening on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
