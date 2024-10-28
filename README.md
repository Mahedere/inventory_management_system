# Inventory Management System

A Node.js based inventory management system with JWT authentication and role-based access control.

## Features

- User Authentication (JWT)
- Role-based access control (Storekeeper and Salesperson)
- Item management (CRUD operations)
- Stock level monitoring
- Notification system
- Search and filter functionality

## Setup

1. Install dependencies:
npm install

2. Create .env file with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h

3. Start MongoDB locally

4. Run the server:
npm run dev

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
  - Body: { name, email, password, role }
- POST /api/auth/login - Login user
  - Body: { email, password }

### Items
- GET /api/items - Get all items
- POST /api/items - Create new item (Storekeeper only)
  - Body: { name, description, model, category, quantity, maxLimit, price }
- PATCH /api/items/:id/quantity - Update item quantity (Salesperson only)
   - Body: { quantity }
- DELETE /api/items/:id - Delete item (Storekeeper only)

### Sales
- POST /api/sales - Record a sale (Salesperson only).
   - Body: { itemId, quantity, customerName, customerContact }
- GET /api/sales/report - Generate sales report (Storekeeper only).
  - Query Parameters: startDate, endDate, salesperson
- GET /api/sales/performance - Get individual salesperson performance (Salesperson only).
 - Query Parameters: startDate, endDate

### Notifications
- GET /api/notifications - Get user notifications
- PATCH /api/notifications/:id/read - Mark notification as read

## Role Permissions

### Storekeeper
- Permissions:
   - Manage items (add, delete).
   - View sales reports.
   - Receive notifications.
- APIs Accessible: /api/items, /api/sales/report, /api/notifications

### Salesperson
- Permissions:
  - View and update item quantities.
  - Record sales transactions.
  - View personal sales performance.
  - Receive notifications.
- APIs Accessible: /api/items, /api/sales, /api/notifications.

## Error Handling
All endpoints include proper error handling and validation.
