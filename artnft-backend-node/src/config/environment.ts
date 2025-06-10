
// src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env file

interface EnvironmentConfig {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    jwtSecret: string;
    jwtExpiresIn: string;
    db: {
        dialect: 'postgres' | 'mysql' | 'sqlite' | 'mssql'; // Add other dialects as needed
        host: string;
        user: string;
        password?: string;
        name: string;
        port: number;
        poolMax: number;
        poolMin: number;
        poolAcquire: number;
        poolIdle: number;
        ssl?: boolean | { require: boolean; rejectUnauthorized: boolean }; // For PostgreSQL SSL
    };
}

const envConfig: EnvironmentConfig = {
    port: parseInt(process.env.PORT || "5000", 10),
    nodeEnv: (process.env.NODE_ENV || 'development') as EnvironmentConfig['nodeEnv'],
    jwtSecret: process.env.JWT_SECRET || 'YOUR_REALLY_STRONG_JWT_SECRET_KEY_CHANGE_ME_IN_DOTENV_IN_BACKEND',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d', // e.g., 1d, 7d, 1h
    db: {
        dialect: (process.env.DB_DIALECT || 'postgres') as EnvironmentConfig['db']['dialect'],
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        name: process.env.DB_NAME || 'artnft_db',
        port: parseInt(process.env.DB_PORT || "5432", 10),
        poolMax: parseInt(process.env.DB_POOL_MAX || "5", 10),
        poolMin: parseInt(process.env.DB_POOL_MIN || "0", 10),
        poolAcquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
        poolIdle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
        // For PostgreSQL SSL, adjust as needed based on your provider
        // ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    // Add other environment variables you might need
};

export default envConfig;
