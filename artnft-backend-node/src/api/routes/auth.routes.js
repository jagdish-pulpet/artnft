
// src/api/routes/auth.routes.js
// For general web user authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// const { validateSignup, validateLogin } = require('../validators/auth.validator'); // Example

// POST /api/auth/signup
router.post('/signup', /*validateSignup,*/ authController.signup);

// POST /api/auth/login
router.post('/login', /*validateLogin,*/ authController.login);

// POST /api/auth/logout (optional, if using server-side session invalidation or blocklists)
// router.post('/logout', authController.logout);

// GET /api/auth/me (example: get current user info if token is valid)
// const { authenticateToken } = require('../../middleware/auth.middleware');
// router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
