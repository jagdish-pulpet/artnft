
// src/controllers/category.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import categoryService from '../services/category.service';
import AppError from '../utils/AppError';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id, 10))) {
            return next(new AppError('Invalid Category ID format.', 400));
        }
        const category = await categoryService.getCategoryById(parseInt(id, 10));
        // Service throws 404 if not found
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description, slug, icon } = req.body;
        // Basic validation, more robust validation can be added via middleware
        if (!name) {
            return next(new AppError('Category name is required.', 400));
        }
        
        const newCategory = await categoryService.createCategory({ name, description, slug, icon });
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id, 10))) {
            return next(new AppError('Invalid Category ID format.', 400));
        }
        const updates = req.body; // { name, description, slug, icon }
        
        const updatedCategory = await categoryService.updateCategory(parseInt(id, 10), updates);
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
         if (isNaN(parseInt(id, 10))) {
            return next(new AppError('Invalid Category ID format.', 400));
        }
        await categoryService.deleteCategory(parseInt(id, 10));
        res.status(200).json({ message: 'Category deleted successfully' }); // Or 204 No Content
    } catch (error) {
        next(error);
    }
};
