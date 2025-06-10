
// src/config/environment.js
require('dotenv').config(); // Load .env file

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT_SECRET is loaded from .env. It's crucial this is set to a strong, unique secret in your .env file.
    jwtSecret: process.env.JWT_SECRET || 'YOUR_REALLY_STRONG_JWT_SECRET_KEY_CHANGE_ME_IN_DOTENV_IN_BACKEND',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d', // e.g., 1d, 7d, 1h
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', 
        name: process.env.DB_NAME || 'artnft_db',
        port: parseInt(process.env.DB_PORT) || 3306,
        poolMax: parseInt(process.env.DB_POOL_MAX) || 5,
        poolMin: parseInt(process.env.DB_POOL_MIN) || 0,
        poolAcquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
        poolIdle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
    // Add other environment variables you might need
};

