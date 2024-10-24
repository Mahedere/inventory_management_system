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
- POST /api/auth/login - Login user

### Items
- GET /api/items - Get all items
- POST /api/items - Create new item (Storekeeper only)
- PATCH /api/items/:id/quantity - Update item quantity (Salesperson only)
- DELETE /api/items/:id - Delete item (Storekeeper only)

### Notifications
- GET /api/notifications - Get user notifications
- PATCH /api/notifications/:id/read - Mark notification as read

## Role Permissions

### Storekeeper
- View items
- Add new items
- Delete items
- Receive notifications

### Salesperson
- View items
- Update item quantities
- Receive notifications

## Error Handling
All endpoints include proper error handling and validation.
