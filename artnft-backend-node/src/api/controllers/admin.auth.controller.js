
// src/api/controllers/admin.auth.controller.js
const authService = require('../../services/auth.service');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required for admin login.' });
        }

        const { token, admin } = await authService.loginAdmin({ email, password });
        
        res.status(200).json({
            message: 'Admin login successful',
            token,
            admin, // admin object here already excludes password_hash from the service
        });

    } catch (error) {
         if (error.status === 401) { // Unauthorized
            return res.status(401).json({ error: error.message });
        }
        // For other errors, forward to the global error handler
        next(error);
    }
};
