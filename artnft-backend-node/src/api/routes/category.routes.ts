
// src/api/routes/category.routes.ts
import express from 'express';
import * as categoryController from '../../controllers/category.controller'; // Adjusted path
import { authenticateToken, authorizeAdmin } from '../../middleware/auth.middleware'; // Adjusted path
// import { validateCreateCategory, validateUpdateCategory } from '../validators/category.validator'; // Example

const router = express.Router();

// GET /api/categories - Get all categories (public)
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get a single category by ID (public)
// Note: ID for categories is INTEGER
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Create a new category (admin only)
router.post('/', authenticateToken, authorizeAdmin, /* validateCreateCategory, */ categoryController.createCategory);

// PUT /api/categories/:id - Update a category (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, /* validateUpdateCategory, */ categoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, categoryController.deleteCategory);

export default router;
