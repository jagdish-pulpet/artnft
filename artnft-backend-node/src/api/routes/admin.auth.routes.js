
// src/api/routes/admin.auth.routes.js
// For admin panel authentication
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin.auth.controller');
// const { validateLogin } = require('../validators/auth.validator'); // Can reuse or have admin specific validator

// POST /api/admin/auth/login
router.post('/login', /*validateLogin,*/ adminAuthController.login);

// POST /api/admin/auth/logout (optional)
// router.post('/logout', adminAuthController.logout);

module.exports = router;
