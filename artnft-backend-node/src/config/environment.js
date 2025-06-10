
// src/config/environment.js
require('dotenv').config(); // Load .env file

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'YOUR_REALLY_STRONG_JWT_SECRET_KEY_CHANGE_ME_IN_DOTENV_IN_BACKEND',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d', // e.g., 1d, 7d, 1h
    db: {
        dialect: process.env.DB_DIALECT || 'postgres', // Added dialect
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres', // Default for PostgreSQL often 'postgres'
        password: process.env.DB_PASSWORD || 'password', // Change to your PG password
        name: process.env.DB_NAME || 'artnft_db',
        port: parseInt(process.env.DB_PORT) || 5432, // Default PostgreSQL port
        poolMax: parseInt(process.env.DB_POOL_MAX) || 5,
        poolMin: parseInt(process.env.DB_POOL_MIN) || 0,
        poolAcquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
        poolIdle: parseInt(process.env.DB_POOL_IDLE) || 10000,
        // For PostgreSQL, SSL might be configured differently or via connection string
        // ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    // Add other environment variables you might need
};
