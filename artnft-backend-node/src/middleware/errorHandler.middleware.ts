
// src/middleware/errorHandler.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import envConfig from '../config/environment';
import AppError from '../utils/AppError';
import { ValidationError, UniqueConstraintError } from 'sequelize'; // Import Sequelize error types

function errorHandler(err: Error | AppError | ValidationError | UniqueConstraintError, req: Request, res: Response, next: NextFunction): void {
    console.error('Global Error Handler Caught:', err.name, err.message);
    if (!(err instanceof AppError) && envConfig.nodeEnv === 'development' && err.stack) {
      console.error(err.stack);
    }

    let statusCode = 500;
    let message = 'Internal Server Error';
    let details: any;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        statusCode = 400; // Bad Request
        message = 'Validation Error';
        if (err instanceof ValidationError && err.errors) {
           details = err.errors.map(e => ({ field: e.path, message: e.message }));
        } else if (err instanceof UniqueConstraintError && err.errors) {
           details = err.errors.map(e => ({ field: e.path, message: `${e.path} must be unique.` }));
        } else {
            details = err.message;
        }
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication Error: Invalid or expired token.';
    }
    
    // For other generic errors in development, you might want to see more details
    if (envConfig.nodeEnv === 'development' && !(err instanceof AppError) && !(err instanceof ValidationError) && !(err instanceof UniqueConstraintError)) {
        message = err.message; // Show actual error message in dev for non-operational errors
    }

    res.status(statusCode).json({
        error: {
            message: message,
            details: details,
            stack: envConfig.nodeEnv === 'development' && !(err instanceof AppError || err instanceof ValidationError || err instanceof UniqueConstraintError) && err.stack ? err.stack : undefined,
        },
    });
}

export default errorHandler;
