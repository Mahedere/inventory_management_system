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

/**
 * @module routes/item
 */

/**
 * @route GET /
 * @group item - Item operations
 * @security JWT
 * @returns {Array.<Item>} 200 - An array of items
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
router.get('/', protect, getItems);

/**
 * @route POST /
 * @group item - Item operations
 * @security JWT
 * @param {string} name.body.required - The name of the item
 * @param {string} description.body.required - The description of the item
 * @param {string} model.body.required - The model of the item
 * @param {string} category.body.required - The category of the item
 * @param {number} quantity.body.required - The quantity of the item (must be non-negative)
 * @param {number} maxLimit.body.required - The maximum limit for the item (must be greater than 0)
 * @returns {object} 201 - The created item's data
 * @returns {Error}  400 - Bad Request if validation fails
 * @returns {Error}  403 - Forbidden if user is not a storekeeper
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
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

/**
 * @route PATCH /:id/quantity
 * @group item - Item operations
 * @security JWT
 * @param {number} quantity.body.required - The new quantity of the item (must be non-negative)
 * @returns {object} 200 - The updated item's data
 * @returns {Error}  404 - Not Found if item does not exist
 * @returns {Error}  400 - Bad Request if validation fails
 * @returns {Error}  403 - Forbidden if user is not a salesperson
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
router.patch('/:id/quantity', [
  protect,
  checkRole(['salesperson']),
  check('quantity', 'Quantity must be a non-negative number').isInt({ min: 0 }),
  validateRequest
], updateItemQuantity);

/**
 * @route DELETE /:id
 * @group item - Item operations
 * @security JWT
 * @returns {object} 200 - Confirmation message
 * @returns {Error}  404 - Not Found if item does not exist
 * @returns {Error}  403 - Forbidden if user is not a storekeeper
 * @returns {Error}  401 - Unauthorized if not authenticated
 */
router.delete('/:id', protect, checkRole(['storekeeper']), deleteItem);

module.exports = router;
