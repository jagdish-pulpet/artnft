
// src/api/controllers/user.controller.js
const userService = require('../../services/user.service');

// Get current authenticated user's profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authenticateToken middleware
        console.log(`Attempting to fetch profile for user ID: ${userId}`);
        
        const user = await userService.getUserById(userId, { excludePassword: true });
        
        if (!user) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        // The user object from service should already be a plain object and exclude password
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update current authenticated user's profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updates = req.body; // e.g., { username, bio, avatar_url, email }
        
        console.log(`User ${userId} attempting to update profile with:`, updates);
        
        const updatedUser = await userService.updateUser(userId, updates);
        // Service method should handle "not found" by throwing or returning null which could be checked here.
        // For now, assuming service returns updated user or throws.
        
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        if (error.status === 409) { // e.g. Email already in use
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
};

// Get NFTs owned by a specific user (publicly viewable on their profile)
exports.getUserNfts = async (req, res, next) => {
    try {
        const { userId } = req.params; // The ID of the user whose NFTs are being requested
        const { limit = 10, page = 1 } = req.query; // For pagination
        console.log(`Attempting to fetch NFTs for user ID: ${userId} with query:`, req.query);
        
        // --- TODO: Implement actual logic using a service (e.g., nftService.getNftsByOwner) ---
        // This service method would find NFTs where owner_id or creator_id matches userId.
        // const nftsData = await nftService.getNftsByOwner(userId, { limit: parseInt(limit), page: parseInt(page) });
        
        // Placeholder response
        const simulatedNfts = Array.from({ length: parseInt(limit) }).map((_, i) => ({
            id: `nft_user${userId}_page${page}_${i}`,
            title: `User ${userId}'s NFT ${i + (parseInt(page)-1)*parseInt(limit)}`,
            imageUrl: `https://placehold.co/300x300.png`,
            price: `${(Math.random()*5).toFixed(1)} ETH`,
            artistName: `User_${userId}`, // Or actual artist if different
            dataAiHint: "mock nft",
        }));
        res.status(200).json({
            data: simulatedNfts,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: 3, // Simulate total pages
            totalItems: 30 // Simulate total items
        });
    } catch (error) {
        next(error);
    }
};

// --- TODO: Add more user-specific controllers as needed ---
// e.g., getUserFavorites, followUser, unfollowUser

