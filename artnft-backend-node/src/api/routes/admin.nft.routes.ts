
// src/api/routes/admin.nft.routes.ts
import express from 'express';
import * as adminNftController from '../../controllers/admin.nft.controller'; // Adjusted path
import { authenticateToken, authorizeAdmin } from '../../middleware/auth.middleware'; // Adjusted path

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(authenticateToken, authorizeAdmin);

// PUT /api/admin/nfts/:id/status - Update NFT status 
// (e.g., 'listed', 'hidden', 'featured', 'pending_moderation', 'rejected')
router.put('/:id/status', adminNftController.updateNftStatus);

// Future:
// GET /api/admin/nfts - Admin view of all NFTs, potentially with more filters/details than public view
// router.get('/', adminNftController.getAllNftsForAdmin);
// POST /api/admin/nfts - Manually add an NFT
// router.post('/', adminNftController.createNftByAdmin);
// PUT /api/admin/nfts/:id - Manually edit an NFT
// router.put('/:id', adminNftController.updateNftByAdmin);
// DELETE /api/admin/nfts/:id - Manually delete an NFT
// router.delete('/:id', adminNftController.deleteNftByAdmin);

export default router;
