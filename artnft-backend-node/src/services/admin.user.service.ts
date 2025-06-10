
// src/services/admin.user.service.ts
import db from '../config/database';
import { Op } from 'sequelize';
import type { UserAttributes, UserInstance } from '../models/User.model';
import AppError from '../utils/AppError';

interface AdminGetAllUsersParams {
    limit?: number;
    page?: number;
    searchTerm?: string;
    status?: UserAttributes['role']; // Assuming status can be 'active', 'suspended', etc. defined in User model
    role?: UserAttributes['role'];
}

interface AdminUsersDataResponse {
    users: Partial<UserAttributes>[]; // Return partial to exclude password_hash
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

class AdminUserService {
    async getAllUsers({
        limit = 10,
        page = 1,
        searchTerm,
        status, // This might need to be mapped to a specific user status field if 'status' is not directly on User model for this purpose.
        role
    }: AdminGetAllUsersParams): Promise<AdminUsersDataResponse> {
        const offset = (Number(page) - 1) * Number(limit);
        const whereClause: any = {};

        if (searchTerm) {
            whereClause[Op.or] = [
                { username: { [Op.iLike]: `%${searchTerm}%` } },
                { email: { [Op.iLike]: `%${searchTerm}%` } },
            ];
        }
        // If 'status' represents something like account_status (active/suspended), adjust User model or query
        // For now, assuming status filter is based on 'role' or a dedicated status field.
        // if (status) {
        //     whereClause.account_status = status; // Example if you had an 'account_status' field
        // }
        if (role) {
            whereClause.role = role;
        }

        const { count, rows } = await db.User.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset,
            attributes: { exclude: ['password_hash'] },
            order: [['createdAt', 'DESC']],
        });
        return { 
            users: rows.map(user => user.toJSON() as Partial<UserAttributes>), 
            totalItems: count, 
            totalPages: Math.ceil(count / Number(limit)), 
            currentPage: Number(page) 
        };
    }

    async getUserById(id: string): Promise<Partial<UserAttributes> | null> {
        const user = await db.User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user.toJSON() as Partial<UserAttributes>;
    }

    async updateUser(id: string, updates: Partial<Pick<UserAttributes, 'username' | 'email' | 'role' | 'bio' | 'avatar_url'>>): Promise<Partial<UserAttributes>> {
        // Ensure updates does not contain password_hash
        if ((updates as any).password_hash || (updates as any).password) {
            throw new AppError("Password updates are not allowed through this method.", 400);
        }

        const user = await db.User.findByPk(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (updates.email && updates.email !== user.email) {
            const existingUser = await db.User.findOne({ where: { email: updates.email } });
            if (existingUser && existingUser.id !== id) {
                throw new AppError('Email already in use by another account.', 409);
            }
        }
        if (updates.username && updates.username !== user.username) {
             const existingUser = await db.User.findOne({ where: { username: updates.username } });
            if (existingUser && existingUser.id !== id) {
                throw new AppError('Username already taken.', 409);
            }
        }

        await user.update(updates);
        const updatedUser = await db.User.findByPk(id, { attributes: { exclude: ['password_hash'] }});
        if(!updatedUser) throw new AppError('Failed to retrieve updated user.', 500); // Should not happen
        return updatedUser.toJSON() as Partial<UserAttributes>;
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await db.User.findByPk(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        // Consider implications: what happens to user's NFTs, bids, etc.? 
        // Schema foreign keys are set to RESTRICT for NFT creator, SET NULL for NFT owner.
        // Soft delete is often preferred: await user.update({ status: 'deleted', deleted_at: new Date() });
        // For this example, we'll proceed with hard delete, but the schema might prevent it if user created NFTs.
        try {
            await user.destroy(); 
            return true;
        } catch(error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new AppError('Cannot delete user. They may have associated records (e.g., created NFTs) that prevent deletion.', 409);
            }
            throw error;
        }
    }
}

export default new AdminUserService();
