const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { checkRole } = require("../middleware/roleCheck");
const { validateRequest } = require("../utils/validation");
const { check } = require("express-validator");
const {
  createSale,
  getSalesReport,
  getSalesPerformance,
} = require("../controllers/saleController");

router.post(
  "/",
  [
    protect,
    checkRole(["salesperson"]),
    check("itemId", "Item ID is required").notEmpty(),
    check("quantity", "Quantity must be greater than 0").isInt({ min: 1 }),
    check("customerName", "Customer name is required").notEmpty(),
    validateRequest,
  ],
  createSale
);

router.get("/report", protect, checkRole(["storekeeper"]), getSalesReport);
router.get(
  "/performance",
  protect,
  checkRole(["salesperson"]),
  getSalesPerformance
);

module.exports = router;
