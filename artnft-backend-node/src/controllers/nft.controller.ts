
// src/controllers/nft.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import nftService from '../services/nft.service';
import AppError from '../utils/AppError';
import type { NftStatusType } from '../models/NFT.model';

// Get all NFTs (with pagination, filtering, sorting options from query)
export const getAllNfts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { 
            limit = '10', 
            page = '1', 
            categoryId, 
            sortBy, 
            sortOrder, 
            searchTerm, 
            status = 'listed', // Default to listed, allow 'all' or other specific statuses
            creatorId,
            ownerId 
        } = req.query as { 
            limit?: string, 
            page?: string, 
            categoryId?: string, 
            sortBy?: any, // Key of NFTAttributes
            sortOrder?: 'ASC' | 'DESC', 
            searchTerm?: string, 
            status?: NftStatusType | 'all',
            creatorId?: string,
            ownerId?: string
        };
        
        const nftsData = await nftService.getAllNfts({ 
            limit: parseInt(limit, 10), 
            page: parseInt(page, 10), 
            categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
            sortBy, 
            sortOrder, 
            searchTerm, 
            status,
            creatorId,
            ownerId
        });
        
        res.status(200).json(nftsData);
    } catch (error) {
        next(error);
    }
};

// Get a single NFT by ID
export const getNftById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const nft = await nftService.getNftById(id);
        if (!nft) {
            return next(new AppError('NFT not found', 404));
        }
        res.status(200).json(nft);
    } catch (error) {
        next(error);
    }
};

// Create a new NFT
export const createNft = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const nftData = req.body; 
        const userId = req.user!.id; // From authenticateToken middleware

        const newNft = await nftService.createNft({ ...nftData, creator_id: userId });
        
        res.status(201).json({ message: 'NFT created successfully. It may be pending review.', nft: newNft });
    } catch (error) {
        next(error);
    }
};

// Update an existing NFT
export const updateNft = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: nftId } = req.params;
        const updates = req.body;
        const userId = req.user!.id;
        const userRole = req.user!.role;
        
        const updatedNft = await nftService.updateNft(nftId, updates, userId, userRole);
        
        res.status(200).json({ message: 'NFT updated successfully', nft: updatedNft });
    } catch (error) {
        next(error);
    }
};

// Delete an NFT
export const deleteNft = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: nftId } = req.params;
        const userId = req.user!.id;
        const userRole = req.user!.role;

        await nftService.deleteNft(nftId, userId, userRole);
        
        res.status(200).json({ message: 'NFT deleted successfully' }); // Or 204 No Content
    } catch (error) {
        next(error);
    }
};

// Place a bid on an NFT
export const placeBid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: nftId } = req.params;
        const { amount } = req.body; // Bid amount (e.g., in ETH as number or string)
        const userId = req.user!.id;

        if (typeof amount !== 'number' || amount <= 0) {
            return next(new AppError('Invalid bid amount.', 400));
        }
        
        const bidResult = await nftService.placeBid(nftId, userId, amount);
        
        res.status(201).json({ message: 'Bid placed successfully', bid: bidResult });
    } catch (error) {
        next(error);
    }
};
