
// src/api/routes/nft.routes.ts
import express from 'express';
import * as nftController from '../../controllers/nft.controller'; // Adjusted path
import { authenticateToken } from '../../middleware/auth.middleware'; // Adjusted path
// import { validateCreateNft, validateUpdateNft, validatePlaceBid } from '../validators/nft.validator'; // Example

const router = express.Router();

// GET /api/nfts - Get all NFTs (with pagination, filtering, sorting)
router.get('/', nftController.getAllNfts);

// GET /api/nfts/:id - Get a single NFT by ID
router.get('/:id', nftController.getNftById);

// POST /api/nfts - Create a new NFT (requires authentication)
router.post('/', authenticateToken, /*validateCreateNft,*/ nftController.createNft);

// PUT /api/nfts/:id - Update an NFT (requires authentication, owner/admin check in service)
router.put('/:id', authenticateToken, /*validateUpdateNft,*/ nftController.updateNft);

// DELETE /api/nfts/:id - Delete an NFT (requires authentication, owner/admin check in service)
router.delete('/:id', authenticateToken, nftController.deleteNft);

// POST /api/nfts/:id/bid - Place a bid on an NFT (requires authentication)
router.post('/:id/bid', authenticateToken, /*validatePlaceBid,*/ nftController.placeBid);

// Future:
// POST /api/nfts/:id/favorite - Favorite/unfavorite an NFT (requires authentication)
// router.post('/:id/favorite', authenticateToken, nftController.toggleFavorite);

export default router;
