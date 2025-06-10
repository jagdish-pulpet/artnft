
// src/api/routes/admin.user.routes.js
// Routes for admin to manage users
const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/admin.user.controller');
const { authenticateToken, authorizeAdmin } = require('../../middleware/auth.middleware');

// All routes in this file are protected and require admin access
router.use(authenticateToken, authorizeAdmin);

// GET /api/admin/users - Get all users
router.get('/', adminUserController.getAllUsers);

// GET /api/admin/users/:id - Get a specific user by ID
router.get('/:id', adminUserController.getUserById);

// PUT /api/admin/users/:id - Update a user (e.g., change role, status)
router.put('/:id', adminUserController.updateUser);

// DELETE /api/admin/users/:id - Delete a user
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
