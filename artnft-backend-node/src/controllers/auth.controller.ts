
// src/controllers/auth.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import authService from '../services/auth.service';
import AppError from '../utils/AppError';
import type { UserAttributes } from '../models/User.model';


// User signup
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, username } = req.body as Pick<UserAttributes, 'email' | 'username'> & { password: UserAttributes['password_hash']};
        
        if (!email || !password) {
            return next(new AppError('Email and password are required.', 400));
        }
        if (password.length < 8) {
            return next(new AppError('Password must be at least 8 characters long.', 400));
        }

        // Pass plain password to service, it will be stored in password_hash attribute for model hook
        const newUser = await authService.signupUser({ email, password_hash: password, username });
        
        res.status(201).json({ 
            message: 'User created successfully. Please log in.', 
            userId: newUser.id,
            username: newUser.username,
            email: newUser.email
        });
    } catch (error) {
        next(error); // Forward to global error handler
    }
};

// User login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body as Pick<UserAttributes, 'email'> & {password: string};
        if (!email || !password) {
            return next(new AppError('Email and password are required.', 400));
        }

        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({
            message: 'Login successful',
            token,
            user,
        });
    } catch (error) {
        next(error);
    }
};
