
// src/services/auth.service.ts
import { User, UserAttributes, UserInstance } from '../models/User.model'; // Assuming User model is now typed
import jwt from 'jsonwebtoken';
import envConfig from '../config/environment';
import AppError from '../utils/AppError';
import db from '../config/database'; // Import the db object which contains initialized models

// Define an interface for user data returned without password
interface UserAuthResponse extends Omit<UserAttributes, 'password_hash' | 'createdAt' | 'updatedAt'> {
  id: string; // Ensure id is always present and string (UUID)
  role: 'user' | 'admin';
  createdAt?: string; // Sequelize returns dates as strings in toJSON()
  updatedAt?: string;
}


class AuthService {
    async signupUser(userData: Pick<UserAttributes, 'email' | 'password_hash' | 'username'>): Promise<UserAuthResponse> {
        const { email, password_hash: plainPassword, username } = userData;

        const existingUserByEmail = await db.User.findOne({ where: { email } });
        if (existingUserByEmail) {
            throw new AppError('Email already in use.', 409);
        }
        if (username) {
            const existingUserByUsername = await db.User.findOne({ where: { username } });
            if (existingUserByUsername) {
                throw new AppError('Username already taken.', 409);
            }
        }

        // The User model's beforeCreate hook will hash the password.
        // We pass the plain password to the password_hash attribute for the hook to process.
        const newUser = await db.User.create({
            email,
            password_hash: plainPassword, // The model hook will hash this
            username: username || null,
            role: 'user', // Default role
        });

        // Exclude password_hash from the returned user object
        const userJson = newUser.toJSON() as UserAttributes & { id: string; role: 'user' | 'admin' };
        const { password_hash, ...userWithoutPassword } = userJson;
        return userWithoutPassword as UserAuthResponse;
    }

    async loginUser({ email, password }: Pick<UserAttributes, 'email'> & {password: string}): Promise<{ token: string; user: UserAuthResponse }> {
        const user = await db.User.findOne({ where: { email } });
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
        
        const userJson = user.toJSON() as UserAttributes & { id: string; role: 'user' | 'admin' };
        const { password_hash, ...userWithoutPassword } = userJson;
        return { token, user: userWithoutPassword as UserAuthResponse };
    }

    async loginAdmin({ email, password }: Pick<UserAttributes, 'email'> & {password: string}): Promise<{ token: string; admin: UserAuthResponse }> {
        const adminUser = await db.User.findOne({ where: { email, role: 'admin' } });
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
        
        const adminJson = adminUser.toJSON() as UserAttributes & { id: string; role: 'user' | 'admin' };
        const { password_hash, ...adminInfo } = adminJson;
        return { token, admin: adminInfo as UserAuthResponse };
    }
}

export default new AuthService();
