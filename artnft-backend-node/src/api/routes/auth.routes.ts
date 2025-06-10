
// src/api/routes/auth.routes.ts
import express from 'express';
import * as authController from '../controllers/auth.controller'; // Use * as for commonjs module style
// import { validateSignup, validateLogin } from '../validators/auth.validator'; // Example

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', /*validateSignup,*/ authController.signup);

// POST /api/auth/login
router.post('/login', /*validateLogin,*/ authController.login);

// POST /api/auth/logout (optional, if using server-side session invalidation or blocklists)
// router.post('/logout', authController.logout);

// GET /api/auth/me (example: get current user info if token is valid)
// import { authenticateToken } from '../../middleware/auth.middleware';
// router.get('/me', authenticateToken, authController.getMe); // getMe needs to be defined in controller

export default router;
