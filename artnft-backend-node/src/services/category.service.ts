
// src/services/category.service.ts
import db from '../config/database';
import AppError from '../utils/AppError';
import type { CategoryAttributes, CategoryInstance } from '../models/Category.model';

class CategoryService {
    async getAllCategories(): Promise<CategoryInstance[]> {
        return db.Category.findAll({ order: [['name', 'ASC']] });
    }

    async getCategoryById(id: number): Promise<CategoryInstance | null> {
        const category = await db.Category.findByPk(id);
        if (!category) {
            throw new AppError('Category not found', 404);
        }
        return category;
    }

    async createCategory(data: Pick<CategoryAttributes, 'name' | 'description' | 'slug' | 'icon'>): Promise<CategoryInstance> {
        // Slug generation is handled by model hook if slug is not provided
        try {
            const newCategory = await db.Category.create(data);
            return newCategory;
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new AppError('Category name or slug already exists.', 409);
            }
            throw error;
        }
    }

    async updateCategory(id: number, updates: Partial<Pick<CategoryAttributes, 'name' | 'description' | 'slug' | 'icon'>>): Promise<CategoryInstance> {
        const category = await db.Category.findByPk(id);
        if (!category) {
            throw new AppError('Category not found', 404);
        }
        // If slug is updated, ensure it remains unique (or let model/DB handle it)
        // If name is updated and slug is not, model hook should regenerate slug
        try {
            await category.update(updates);
            return category.reload(); // reload to get updated data, including potentially auto-updated slug
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new AppError('Category name or slug already exists.', 409);
            }
            throw error;
        }
    }

    async deleteCategory(id: number): Promise<boolean> {
        const category = await db.Category.findByPk(id);
        if (!category) {
            throw new AppError('Category not found', 404);
        }
        // Foreign key constraint ON DELETE SET NULL on NFTs table will handle associated NFTs.
        await category.destroy();
        return true;
    }
}

export default new CategoryService();
