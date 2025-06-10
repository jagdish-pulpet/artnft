
// src/api/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');

// GET /api/users/profile - Get current authenticated user's profile
router.get('/profile', authenticateToken, userController.getUserProfile);

// PUT /api/users/profile - Update current authenticated user's profile
router.put('/profile', authenticateToken, userController.updateUserProfile);

// GET /api/users/:userId/nfts - Get NFTs owned by a specific user (public or protected based on your logic)
// This is different from admin getting all users or a specific user. This is for public profiles.
router.get('/:userId/nfts', userController.getUserNfts); 

// GET /api/users/:userId/favorites - Get NFTs favorited by a specific user (if public feature)
// router.get('/:userId/favorites', userController.getUserFavorites);

// POST /api/users/follow/:userIdToFollow - Follow another user
// router.post('/follow/:userIdToFollow', authenticateToken, userController.followUser);

// DELETE /api/users/unfollow/:userIdToUnfollow - Unfollow another user
// router.delete('/unfollow/:userIdToUnfollow', authenticateToken, userController.unfollowUser);

module.exports = router;
