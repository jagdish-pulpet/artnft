
// src/middleware/auth.middleware.ts
import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../config/environment';

export interface UserPayload {
  id: string; // Or number, depending on your User ID type
  email: string;
  username?: string | null;
  role: 'user' | 'admin';
  // Add any other fields you include in the JWT payload
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        // Use return to stop execution after sending response
        res.status(401).json({ error: 'Unauthorized: No token provided.' });
        return;
    }

    jwt.verify(token, envConfig.jwtSecret, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({ error: 'Unauthorized: Token expired.' });
                return;
            }
            console.error('JWT Verification Error:', err.message);
            res.status(403).json({ error: 'Forbidden: Invalid token.' });
            return;
        }
        
        // Assuming 'user' contains the decoded payload matching UserPayload
        req.user = user as UserPayload; 
        next();
    });
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // This middleware should be used *after* authenticateToken
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
};
