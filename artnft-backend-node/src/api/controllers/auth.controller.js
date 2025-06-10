
// src/api/controllers/auth.controller.js
const authService = require('../../services/auth.service');
// const { validationResult } = require('express-validator'); // If using express-validator

// User signup
exports.signup = async (req, res, next) => {
    try {
        // Example for express-validator:
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { email, password, username } = req.body;
        // Basic validation (more robust validation should be in a validator middleware or service)
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        if (password.length < 8) { // Example: Enforce password length
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        const newUser = await authService.signupUser({ email, password, username });
        // On successful signup, respond with a success message and user ID (excluding sensitive info)
        res.status(201).json({ message: 'User created successfully. Please log in.', userId: newUser.id });
    } catch (error) {
        if (error.status === 409) { // Conflict - e.g., email already exists
            return res.status(409).json({ error: error.message });
        }
        // For other errors, forward to the global error handler
        next(error);
    }
};

// User login
exports.login = async (req, res, next) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({
            message: 'Login successful',
            token,
            user, // user object here already excludes password_hash from the service
        });
    } catch (error) {
        if (error.status === 401) { // Unauthorized - e.g., invalid credentials
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
};

// Optional: Get current user (me) endpoint - requires authentication middleware
// const userService = require('../../services/user.service'); // If you need fresh data not from token
// exports.getMe = async (req, res, next) => {
//     try {
//         // req.user is populated by authenticateToken middleware
//         // This typically contains { id, email, role } from the JWT payload
//         // If you need more/fresh user data, fetch it using userService
//         // const userProfile = await userService.getUserById(req.user.id, { excludePassword: true });
//         // if (!userProfile) {
//         //     return res.status(404).json({ error: 'User not found' });
//         // }
//         // res.status(200).json(userProfile);

//         // For simplicity, if req.user from token is enough:
//         res.status(200).json(req.user);

//     } catch (error) {
//         next(error);
//     }
// };
