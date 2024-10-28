const Sale = require('../models/Sale');
const Item = require('../models/Item');
const { APIError } = require('../utils/errorHandler');

/*
 * Create a new sale record
 * @route POST /api/sales
 * @access Private/Salesperson
 */
const createSale = async (req, res) => {
  try {
    const { itemId, quantity, customerName, customerContact } = req.body;

    // Find the item and check stock
    const item = await Item.findById(itemId);
    if (!item) {
      throw new APIError('Item not found', 404);
    }

    if (item.quantity < quantity) {
      throw new APIError('Insufficient stock', 400);
    }

    // Calculate total amount and validate
    const totalAmount = item.price * quantity;
    if (isNaN(totalAmount)) {
      throw new APIError('Invalid total amount calculation', 400);
    }

    // Create sale record
    const sale = await Sale.create({
      item: itemId,
      quantity,
      soldBy: req.user._id,
      totalAmount,
      customerName,
      customerContact,
      saleDate: new Date() // Set the current date and time
    });

    // Update item quantity
    item.quantity -= quantity;
    await item.save();

    // Populate sale with item and user details
    await sale.populate([
      { path: 'item', select: 'name price' },
      { path: 'soldBy', select: 'name email' }
    ]);

    res.status(201).json(sale);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

/*
 * Get sales report
 * @route GET /api/sales/report
 * @access Private/Storekeeper
 */
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, salesperson } = req.query;
    const query = {};

    // Add date range to query
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }

    // Add salesperson filter
    if (salesperson) {
      query.soldBy = salesperson;
    }

    // Get sales with populated data
    const sales = await Sale.find(query)
      .populate('item', 'name price')
      .populate('soldBy', 'name email')
      .sort('-saleDate');

    // Calculate summary statistics
    const totalSales = await Sale.countDocuments(query);

    // Calculate total revenue
    const totalRevenueResult = await Sale.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

    // Calculate sales by salesperson
    const salesBySalesperson = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$soldBy',
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalItems: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'salesperson'
        }
      },
      { $unwind: '$salesperson' },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          totalRevenue: 1,
          totalItems: 1,
          'salesperson.name': 1,
          'salesperson.email': 1
        }
      }
    ]);

    const summary = { totalSales, totalRevenue, salesBySalesperson };

    res.json({ sales, summary });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get individual salesperson performance
 * @route GET /api/sales/performance
 * @access Private/Salesperson
 */
const getSalesPerformance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    const query = { soldBy: userId };

    // Add date range to query
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }

    // Get performance metrics
    const performanceResult = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalItems: { $sum: '$quantity' },
          averageSaleValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const performance = performanceResult[0] || {
      totalSales: 0,
      totalRevenue: 0,
      totalItems: 0,
      averageSaleValue: 0
    };

    // Get daily sales trend
    const dailyTrend = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          items: { $sum: '$quantity' }
        }
      },
      { $sort: { '_id': 1 } } // Sort by date
    ]);

    res.json({ performance, dailyTrend });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createSale,
  getSalesReport,
  getSalesPerformance
};
