
// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const envConfig = require('../config/environment');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, envConfig.jwtSecret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Unauthorized: Token expired.' });
            }
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ error: 'Forbidden: Invalid token.' });
        }
        req.user = user; // Add payload (id, email, role) to request object
        next();
    });
};

exports.authorizeAdmin = (req, res, next) => {
    // This middleware should be used *after* authenticateToken
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
};
