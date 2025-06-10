// src/services/auth.service.js
const { User } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Keep for direct comparison if needed, though model handles it
const envConfig = require('../config/environment');
const AppError = require('../utils/AppError');

class AuthService {
    async signupUser({ email, password, username }) {
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            throw new AppError('Email already in use.', 409);
        }
        if (username) {
            const existingUserByUsername = await User.findOne({ where: { username } });
            if (existingUserByUsername) {
                throw new AppError('Username already taken.', 409);
            }
        }

        // The User model's beforeCreate hook will hash the password_hash field.
        // We pass the plain password to password_hash attribute for the hook to process.
        const newUser = await User.create({
            email,
            password_hash: password, // The model hook will hash this
            username: username || null, // Handle optional username
            role: 'user', // Default role
        });

        // Exclude password_hash from the returned user object
        const { password_hash, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;
    }

    async loginUser({ email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new AppError('Invalid credentials. User not found.', 401);
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            throw new AppError('Invalid credentials. Password mismatch.', 401);
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(payload, envConfig.jwtSecret, {
            expiresIn: envConfig.jwtExpiresIn,
        });

        const { password_hash, ...userWithoutPassword } = user.toJSON();
        return { token, user: userWithoutPassword };
    }

    async loginAdmin({ email, password }) {
        const adminUser = await User.findOne({ where: { email, role: 'admin' } });
        if (!adminUser) {
            throw new AppError('Admin account not found or invalid credentials.', 401);
        }

        const isMatch = await adminUser.isValidPassword(password);
        if (!isMatch) {
            throw new AppError('Invalid admin credentials.', 401);
        }

        const payload = {
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
            role: adminUser.role,
        };

        const token = jwt.sign(payload, envConfig.jwtSecret, {
            expiresIn: envConfig.jwtExpiresIn || '1h', // Admin sessions might be shorter
        });
        
        const { password_hash, ...adminInfo } = adminUser.toJSON();
        return { token, admin: adminInfo };
    }
}

module.exports = new AuthService();
