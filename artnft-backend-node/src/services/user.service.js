
// src/services/user.service.js
const { User } = require('../config/database'); // Corrected import
const bcrypt = require('bcryptjs');

class UserService {
    async findUserByEmail(email) {
        // This method is primarily used by auth.service.js for login
        console.log(`UserService.findUserByEmail called for: ${email}`);
        return User.findOne({ where: { email } });
    }

    async getUserById(id, options = {}) {
        console.log(`UserService.getUserById called for ID: ${id}`);
        const queryOptions = { where: { id } };
        if (options.excludePassword) {
            queryOptions.attributes = { exclude: ['password_hash'] };
        }
        const user = await User.findByPk(id, queryOptions);
        if (user) {
            return user.toJSON(); // Return as plain object
        }
        return null;
    }

    async updateUser(id, updateData) {
        console.log(`UserService.updateUser called for ID: ${id} with data:`, updateData);
        const user = await User.findByPk(id);
        if (!user) {
           const error = new Error('User not found.');
           error.status = 404;
           throw error;
        }

        // Prevent direct password_hash update through this generic method
        if (updateData.password_hash) delete updateData.password_hash;
        if (updateData.password) delete updateData.password; // Also remove plain password if sent

        // Handle email change carefully: check for uniqueness if email is being updated
        if (updateData.email && updateData.email !== user.email) {
            const existingUserWithNewEmail = await User.findOne({ where: { email: updateData.email } });
            if (existingUserWithNewEmail && existingUserWithNewEmail.id !== id) {
                const error = new Error('Email already in use by another account.');
                error.status = 409; // Conflict
                throw error;
            }
        }
        
        // Fields that can be updated
        const allowedUpdates = ['username', 'bio', 'avatar_url', 'email']; // Add other updatable fields
        const filteredUpdateData = {};
        for (const key of allowedUpdates) {
            if (updateData.hasOwnProperty(key)) {
                filteredUpdateData[key] = updateData[key];
            }
        }

        if (Object.keys(filteredUpdateData).length === 0) {
            // No valid fields to update, return current user data or a message
            return user.toJSON(); // Or throw new Error('No updatable fields provided.');
        }
        
        await user.update(filteredUpdateData);
        const updatedUserInstance = await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] } // Ensure password is excluded
        });
        return updatedUserInstance.toJSON();
    }
    
    // Add other user-related service methods here, e.g., for handling follows, favorites (if managed server-side)
}

module.exports = new UserService();

