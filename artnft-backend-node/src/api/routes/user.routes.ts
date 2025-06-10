
// src/api/routes/user.routes.ts
import express from 'express';
import * as userController from '../../controllers/user.controller'; // Adjusted path
import { authenticateToken } from '../../middleware/auth.middleware'; // Adjusted path

const router = express.Router();

// GET /api/users/profile - Get current authenticated user's profile
router.get('/profile', authenticateToken, userController.getUserProfile);

// PUT /api/users/profile - Update current authenticated user's profile
router.put('/profile', authenticateToken, userController.updateUserProfile);

// GET /api/users/:userId/nfts - Get NFTs by a specific user (e.g., for their public profile page)
router.get('/:userId/nfts', userController.getUserNfts); 

// Future:
// GET /api/users/:userId/favorites - Get NFTs favorited by a specific user (if public feature)
// router.get('/:userId/favorites', userController.getUserFavorites);
// POST /api/users/follow/:userIdToFollow - Follow another user
// router.post('/follow/:userIdToFollow', authenticateToken, userController.followUser);
// DELETE /api/users/unfollow/:userIdToUnfollow - Unfollow another user
// router.delete('/unfollow/:userIdToUnfollow', authenticateToken, userController.unfollowUser);

export default router;
