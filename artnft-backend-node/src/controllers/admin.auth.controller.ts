
// src/controllers/admin.auth.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import authService from '../services/auth.service';
import AppError from '../utils/AppError';
import type { UserAttributes } from '../models/User.model';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body as Pick<UserAttributes, 'email'> & {password: string};
        if (!email || !password) {
            return next(new AppError('Email and password are required for admin login.', 400));
        }

        const { token, admin } = await authService.loginAdmin({ email, password });
        
        res.status(200).json({
            message: 'Admin login successful',
            token,
            admin,
        });

    } catch (error) {
        next(error);
    }
};
