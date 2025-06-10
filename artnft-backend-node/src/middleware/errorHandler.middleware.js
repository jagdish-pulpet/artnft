
// src/middleware/errorHandler.middleware.js
const envConfig = require('../config/environment');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error('Global Error Handler Caught:', err.name, err.message, err.stack);

    const statusCode = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Specific error handling (e.g., Sequelize validation errors)
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        message = 'Validation Error'; // Override generic message
        return res.status(400).json({
            error: message,
            details: err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : err.message,
        });
    }
    
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        message = 'Authentication Error: Invalid or expired token.';
        return res.status(401).json({
            error: message,
        });
    }
    
    // Default error response
    res.status(statusCode).json({
        error: {
            message: message,
            // Optionally include stack trace in development
            stack: envConfig.nodeEnv === 'development' && err.stack ? err.stack : undefined,
        },
    });
}

module.exports = errorHandler;
