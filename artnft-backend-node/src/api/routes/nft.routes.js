
// src/api/routes/nft.routes.js
const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nft.controller');
const { authenticateToken } = require('../../middleware/auth.middleware'); // For actions requiring login
// const { validateCreateNft } = require('../validators/nft.validator'); // Example

// GET /api/nfts - Get all NFTs (with pagination, filtering, sorting)
router.get('/', nftController.getAllNfts);

// GET /api/nfts/:id - Get a single NFT by ID
router.get('/:id', nftController.getNftById);

// POST /api/nfts - Create a new NFT (requires authentication)
router.post('/', authenticateToken, /*validateCreateNft,*/ nftController.createNft);

// PUT /api/nfts/:id - Update an NFT (requires authentication, owner/admin check)
router.put('/:id', authenticateToken, nftController.updateNft);

// DELETE /api/nfts/:id - Delete an NFT (requires authentication, owner/admin check)
router.delete('/:id', authenticateToken, nftController.deleteNft);

// POST /api/nfts/:id/bid - Place a bid on an NFT (requires authentication)
router.post('/:id/bid', authenticateToken, nftController.placeBid);

// POST /api/nfts/:id/favorite - Favorite/unfavorite an NFT (requires authentication)
// router.post('/:id/favorite', authenticateToken, nftController.toggleFavorite);

module.exports = router;
