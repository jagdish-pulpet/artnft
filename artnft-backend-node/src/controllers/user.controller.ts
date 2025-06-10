
// src/controllers/user.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import userService from '../services/user.service';
import nftService from '../services/nft.service'; // For user's NFTs
import AppError from '../utils/AppError';

// Get current authenticated user's profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id; // From authenticateToken middleware, non-null asserted
        
        const user = await userService.getUserById(userId, { excludePassword: true });
        
        if (!user) {
            // This case should ideally not be reached if token is valid and user exists
            return next(new AppError('User profile not found.', 404));
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update current authenticated user's profile
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const updates = req.body; // e.g., { username, bio, avatar_url, email }
        
        const updatedUser = await userService.updateUser(userId, updates);
        
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// Get NFTs by a specific user (publicly viewable on their profile)
export const getUserNfts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params; 
        const { limit = '10', page = '1' } = req.query as { limit?: string, page?: string };
        
        // Fetch NFTs where user is creator OR owner, or adjust logic as needed.
        // Here, let's assume we fetch NFTs created by the user.
        // To fetch owned NFTs, you would use ownerId: userId
        const nftsData = await nftService.getAllNfts({ 
            creatorId: userId, 
            limit: parseInt(limit, 10), 
            page: parseInt(page, 10),
            status: 'all' // Show all statuses on profile page, or 'listed' if preferred
        });
        
        res.status(200).json(nftsData);
    } catch (error) {
        next(error);
    }
};
