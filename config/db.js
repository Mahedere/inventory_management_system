const mongoose = require("mongoose");
/**
 * Connects to the MongoDB database using the provided URI from environment variables or a default local URI.
 * @async
 * @function connectDB
 * @throws Will throw an error if the connection to MongoDB fails.
 * @returns {Promise<void>} Resolves when the database connection is successful.
 */
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://mahederetebebe98:efoEWiKKVy1SyIwy@inventory.0kfn8.mongodb.net/";

    // Connect to MongoDB using the URI
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDB;
