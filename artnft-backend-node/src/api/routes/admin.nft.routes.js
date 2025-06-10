
// src/api/routes/admin.nft.routes.js
// Routes for admin to manage NFTs (e.g., change status, feature)
const express = require('express');
const router = express.Router();
const adminNftController = require('../controllers/admin.nft.controller');
const { authenticateToken, authorizeAdmin } = require('../../middleware/auth.middleware');

// All routes in this file are protected and require admin access
router.use(authenticateToken, authorizeAdmin);

// PUT /api/admin/nfts/:id/status - Update NFT status (e.g., 'listed', 'hidden', 'featured', 'pending_moderation', 'rejected')
router.put('/:id/status', adminNftController.updateNftStatus);

// GET /api/admin/nfts - (Optional) Admin view of all NFTs, potentially with more filters/details than public view
// router.get('/', adminNftController.getAllNftsForAdmin);


module.exports = router;
