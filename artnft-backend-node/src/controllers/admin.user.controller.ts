
// src/controllers/admin.user.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import adminUserService from '../services/admin.user.service';
import AppError from '../utils/AppError';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { 
            limit = '10', 
            page = '1', 
            searchTerm, 
            status, // This might need specific handling based on your User model 'status' field
            role 
        } = req.query as { 
            limit?: string, 
            page?: string, 
            searchTerm?: string, 
            status?: any, // Define more strictly if UserAttributes has a status field for this
            role?: 'user' | 'admin'
        };
        
        const usersData = await adminUserService.getAllUsers({ 
            limit: parseInt(limit, 10), 
            page: parseInt(page, 10), 
            searchTerm, 
            status, 
            role 
        });
        
        res.status(200).json(usersData);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await adminUserService.getUserById(id);
        // Service throws 404 if not found
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body; // e.g., { role, status (if applicable), bio, etc. }
        
        const updatedUser = await adminUserService.updateUser(id, updates);
        res.status(200).json({ message: 'User updated successfully by admin', user: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await adminUserService.deleteUser(id);
        res.status(200).json({ message: 'User deleted successfully by admin' }); // Or 204 No Content
    } catch (error) {
        next(error);
    }
};
