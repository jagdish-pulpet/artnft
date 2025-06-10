
// src/services/user.service.ts
import db from '../config/database';
import AppError from '../utils/AppError';
import type { UserAttributes, UserInstance } from '../models/User.model';

interface UpdateUserOptions {
    excludePassword?: boolean;
}

class UserService {
    async findUserByEmail(email: string): Promise<UserInstance | null> {
        console.log(`UserService.findUserByEmail called for: ${email}`);
        return db.User.findOne({ where: { email } });
    }

    async getUserById(id: string, options: UpdateUserOptions = {}): Promise<Partial<UserAttributes> | null> {
        console.log(`UserService.getUserById called for ID: ${id}`);
        const queryOptions: any = { where: { id } };
        if (options.excludePassword) {
            queryOptions.attributes = { exclude: ['password_hash'] };
        }
        const user = await db.User.findByPk(id, queryOptions);
        if (user) {
            return user.toJSON() as Partial<UserAttributes>;
        }
        return null;
    }

    async updateUser(id: string, updateData: Partial<UserAttributes>): Promise<Partial<UserAttributes>> {
        console.log(`UserService.updateUser called for ID: ${id} with data:`, updateData);
        const user = await db.User.findByPk(id);
        if (!user) {
           throw new AppError('User not found.', 404);
        }

        // Prevent direct password_hash update through this generic method
        if (updateData.password_hash) delete updateData.password_hash;
        // if (updateData.password) delete updateData.password; // If plain password might be sent

        // Handle email change carefully: check for uniqueness if email is being updated
        if (updateData.email && updateData.email !== user.email) {
            const existingUserWithNewEmail = await db.User.findOne({ where: { email: updateData.email } });
            if (existingUserWithNewEmail && existingUserWithNewEmail.id !== id) {
                throw new AppError('Email already in use by another account.', 409);
            }
        }
        
        // Fields that can be updated
        const allowedUpdates: (keyof UserAttributes)[] = ['username', 'bio', 'avatar_url', 'email'];
        const filteredUpdateData: Partial<UserAttributes> = {};
        for (const key of allowedUpdates) {
            if (updateData.hasOwnProperty(key)) {
                (filteredUpdateData as any)[key] = updateData[key];
            }
        }

        if (Object.keys(filteredUpdateData).length === 0) {
            const currentUserData = user.toJSON() as Partial<UserAttributes>;
            delete currentUserData.password_hash;
            return currentUserData;
        }
        
        await user.update(filteredUpdateData);
        const updatedUserInstance = await db.User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!updatedUserInstance) { // Should not happen if update was successful
            throw new AppError('Failed to retrieve updated user.', 500);
        }
        return updatedUserInstance.toJSON() as Partial<UserAttributes>;
    }
}

export default new UserService();
