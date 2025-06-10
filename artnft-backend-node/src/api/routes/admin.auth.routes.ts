
// src/api/routes/admin.auth.routes.ts
import express from 'express';
import * as adminAuthController from '../controllers/admin.auth.controller';
// const { validateLogin } = require('../validators/auth.validator'); // Can reuse or have admin specific validator

const router = express.Router();

// POST /api/admin/auth/login
router.post('/login', /*validateLogin,*/ adminAuthController.login);

// POST /api/admin/auth/logout (optional)
// router.post('/logout', adminAuthController.logout);

export default router;
