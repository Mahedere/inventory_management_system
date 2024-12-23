require('dotenv').config();
const express = require('express');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const itemRoutes = require('../routes/itemRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const saleRoutes = require('../routes/saleRoutes');
const userRoutes = require('../routes/userRoutes');
const app = express();
const cors = require("cors");

// Connect to database
connectDB();

// Middleware
app.use(
    cors({
        origin: "https://inventory-management-system-kappa-silk.vercel.app",
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],    // credentials: true
    }))
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;"
    );
    next();
  });  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/users', userRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
