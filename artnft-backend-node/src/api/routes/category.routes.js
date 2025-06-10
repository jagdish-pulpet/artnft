
// src/api/routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeAdmin } = require('../../middleware/auth.middleware');
// const { validateCreateCategory, validateUpdateCategory } = require('../validators/category.validator'); // Example

// GET /api/categories - Get all categories (public)
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get a single category by ID (public)
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Create a new category (admin only)
router.post('/', authenticateToken, authorizeAdmin, /* validateCreateCategory, */ categoryController.createCategory);

// PUT /api/categories/:id - Update a category (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, /* validateUpdateCategory, */ categoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;
