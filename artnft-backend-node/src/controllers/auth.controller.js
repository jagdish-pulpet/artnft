// src/api/controllers/auth.controller.js
const authService = require('../../services/auth.service');
const AppError = require('../../utils/AppError');

// User signup
exports.signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        
        if (!email || !password) {
            // More specific validation should be in a middleware or service layer ideally
            return next(new AppError('Email and password are required.', 400));
        }
        if (password.length < 8) {
            return next(new AppError('Password must be at least 8 characters long.', 400));
        }

        const newUser = await authService.signupUser({ email, password, username });
        // On successful signup, respond with a success message (user data excluded for privacy on signup response)
        res.status(201).json({ 
            message: 'User created successfully. Please log in.', 
            userId: newUser.id, // Return only userId for confirmation
            username: newUser.username,
            email: newUser.email
        });
    } catch (error) {
        // Forward error to the global error handler
        // Specific status codes (like 409 for conflict) should be set in the service/AppError
        next(error);
    }
};

// User login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Email and password are required.', 400));
        }

        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({
            message: 'Login successful',
            token,
            user, // user object already excludes password_hash from the service
        });
    } catch (error) {
        next(error);
    }
};
