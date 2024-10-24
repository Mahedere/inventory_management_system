const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { validateRequest } = require('../utils/validation');
const { check } = require('express-validator');
const {
  createItem,
  updateItemQuantity,
  getItems,
  deleteItem,
} = require('../controllers/itemController');

router.get('/', protect, getItems);

router.post('/', [
  protect,
  checkRole(['storekeeper']),
  check('name', 'Name is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('model', 'Model is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('quantity', 'Quantity must be a non-negative number').isInt({ min: 0 }),
  check('maxLimit', 'Max limit must be greater than 0').isInt({ min: 1 }),
  validateRequest
], createItem);

router.patch('/:id/quantity', [
  protect,
  checkRole(['salesperson']),
  check('quantity', 'Quantity must be a non-negative number').isInt({ min: 0 }),
  validateRequest
], updateItemQuantity);

router.delete('/:id', protect, checkRole(['storekeeper']), deleteItem);

module.exports = router;
