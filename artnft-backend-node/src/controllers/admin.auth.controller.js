// src/api/controllers/admin.auth.controller.js
const authService = require('../../services/auth.service');
const AppError = require('../../utils/AppError');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Email and password are required for admin login.', 400));
        }

        const { token, admin } = await authService.loginAdmin({ email, password });
        
        res.status(200).json({
            message: 'Admin login successful',
            token,
            admin, // admin object here already excludes password_hash from the service
        });

    } catch (error) {
        // Forward error to the global error handler
        next(error);
    }
};
