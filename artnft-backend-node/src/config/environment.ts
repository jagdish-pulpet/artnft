
// src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env file

interface EnvironmentConfig {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    jwtSecret: string;
    jwtExpiresIn: string;
    db: {
        dialect: 'postgres' | 'mysql' | 'sqlite' | 'mssql';
        host: string;
        user: string;
        password?: string;
        name: string;
        port: number;
        poolMax: number;
        poolMin: number;
        poolAcquire: number;
        poolIdle: number;
        ssl?: boolean | { require: boolean; rejectUnauthorized: boolean };
    };
}

const envConfig: EnvironmentConfig = {
    port: parseInt(process.env.PORT || "5000", 10),
    nodeEnv: (process.env.NODE_ENV || 'development') as EnvironmentConfig['nodeEnv'],
    jwtSecret: process.env.JWT_SECRET || 'YOUR_REALLY_STRONG_JWT_SECRET_KEY_CHANGE_ME_IN_DOTENV_IN_BACKEND',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    db: {
        dialect: (process.env.DB_DIALECT || 'postgres') as EnvironmentConfig['db']['dialect'],
        host: process.env.DB_HOST || 'db.lyikgkveynfetfadsjix.supabase.co', // Updated Supabase host
        user: process.env.DB_USER || 'postgres',                     // Default Supabase user
        password: process.env.DB_PASSWORD || 'YOUR_SUPABASE_DATABASE_PASSWORD_HERE', // Placeholder for user's actual password
        name: process.env.DB_NAME || 'postgres',                     // Default Supabase database name
        port: parseInt(process.env.DB_PORT || "5432", 10),           // Default Supabase port
        poolMax: parseInt(process.env.DB_POOL_MAX || "5", 10),
        poolMin: parseInt(process.env.DB_POOL_MIN || "0", 10),
        poolAcquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
        poolIdle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
        // For Supabase, SSL is typically handled by default and might not need explicit true/false.
        // If direct connection issues arise, Supabase docs might specify SSL mode.
        // ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
};

export default envConfig;
