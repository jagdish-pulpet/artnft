
// src/api/routes/admin.user.routes.ts
import express from 'express';
import * as adminUserController from '../../controllers/admin.user.controller'; // Adjusted path
import { authenticateToken, authorizeAdmin } from '../../middleware/auth.middleware'; // Adjusted path

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(authenticateToken, authorizeAdmin);

// GET /api/admin/users - Get all users (with pagination, filtering)
router.get('/', adminUserController.getAllUsers);

// GET /api/admin/users/:id - Get a specific user by ID
router.get('/:id', adminUserController.getUserById);

// PUT /api/admin/users/:id - Update a user (e.g., change role, status)
router.put('/:id', adminUserController.updateUser);

// DELETE /api/admin/users/:id - Delete a user
router.delete('/:id', adminUserController.deleteUser);

export default router;
