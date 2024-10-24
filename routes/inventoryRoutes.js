const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const inventoryRouter = express.Router();

// Protected route accessible only by storekeepers
inventoryRouter.get("/",verifyToken(["storekeeper"]),  (req, res) => {
  res.send("Welcome, storekeeper!");
});

// Protected route accessible only by salespersons
inventoryRouter.get("/sales", verifyToken(["salesperson"]), (req, res) => {
  res.send("Welcome, salesperson!");
});

// Route accessible by both storekeepers and salespersons
inventoryRouter.get("/inventory", verifyToken(["storekeeper", "salesperson"]), (req, res) => {
  res.send("Inventory management");
});

module.exports = inventoryRouter;
// export default inventoryRouter;