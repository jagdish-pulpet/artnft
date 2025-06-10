
// src/services/nft.service.ts
import db from '../config/database';
import { Op } from 'sequelize';
import type { NFTAttributes, NFTInstance, NftStatusType } from '../models/NFT.model';
import type { UserInstance } from '../models/User.model';
import type { CategoryInstance } from '../models/Category.model';
import AppError from '../utils/AppError';

interface GetAllNftsParams {
    limit?: number;
    page?: number;
    categoryId?: number;
    sortBy?: keyof NFTAttributes | 'price' | 'dateListed'; // Allow 'price' and 'dateListed' as aliases
    sortOrder?: 'ASC' | 'DESC';
    searchTerm?: string;
    status?: NftStatusType | 'all'; // Allow 'all'
    creatorId?: string;
    ownerId?: string;
}

interface NftsDataResponse {
    nfts: NFTInstance[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

class NftService {
    async getAllNfts({
        limit = 10,
        page = 1,
        categoryId,
        sortBy,
        sortOrder = 'DESC',
        searchTerm,
        status = 'listed',
        creatorId,
        ownerId,
    }: GetAllNftsParams): Promise<NftsDataResponse> {
        const offset = (Number(page) - 1) * Number(limit);
        const whereClause: any = {};

        if (status && status !== 'all') {
             whereClause.status = status;
        }
        if (categoryId) {
            whereClause.category_id = categoryId;
        }
        if (creatorId) {
            whereClause.creator_id = creatorId;
        }
        if (ownerId) {
            whereClause.owner_id = ownerId;
        }
        if (searchTerm) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${searchTerm}%` } },
                { description: { [Op.iLike]: `%${searchTerm}%` } },
                // To search by artist name, we'd need to join with User model
                // This can be added if include for User (creator) is used
            ];
        }
        
        const order: any[] = [];
        if (sortBy) {
            const sortField = sortBy === 'price' ? 'price_eth' : sortBy === 'dateListed' ? 'createdAt' : sortBy;
            order.push([sortField, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']);
        } else {
            order.push(['createdAt', 'DESC']);
        }

        const { count, rows } = await db.NFT.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset,
            order,
            include: [
                { model: db.User, as: 'creator', attributes: ['id', 'username', 'avatar_url'] },
                { model: db.User, as: 'owner', attributes: ['id', 'username', 'avatar_url'] },
                { model: db.Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ],
            distinct: true,
        });
        return { nfts: rows, totalItems: count, totalPages: Math.ceil(count / Number(limit)), currentPage: Number(page) };
    }

    async getNftById(id: string): Promise<NFTInstance | null> {
        return db.NFT.findByPk(id, {
            include: [
                { model: db.User, as: 'creator', attributes: ['id', 'username', 'avatar_url'] },
                { model: db.User, as: 'owner', attributes: ['id', 'username', 'avatar_url'] },
                { model: db.Category, as: 'category', attributes: ['id', 'name', 'slug'] },
                // { model: db.Bid, as: 'bids', include: [{model: db.User, attributes: ['username']}], order: [['bid_time', 'DESC']] } // When Bid model is ready
            ]
        });
    }

    async createNft(nftData: Omit<NFTAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<NFTInstance> {
        // creator_id must be part of nftData
        if (!nftData.creator_id) {
            throw new AppError('Creator ID is required to create an NFT.', 400);
        }
        return db.NFT.create(nftData);
    }

    async updateNft(id: string, updates: Partial<NFTAttributes>, userId: string, userRole: 'user' | 'admin'): Promise<NFTInstance | null> {
        const nft = await db.NFT.findByPk(id);
        if (!nft) {
            throw new AppError('NFT not found.', 404);
        }
        // Authorization check: User must be creator or admin
        if (nft.creator_id !== userId && userRole !== 'admin') {
            throw new AppError('Not authorized to update this NFT.', 403);
        }
        // Prevent status updates to sensitive states like 'sold' by non-admin if needed
        // e.g. if (updates.status === 'sold' && userRole !== 'admin') delete updates.status;

        await nft.update(updates);
        return nft.reload({ // reload to get updated data with associations if needed
             include: [
                { model: db.User, as: 'creator', attributes: ['id', 'username', 'avatar_url'] },
                { model: db.Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });
    }

    async deleteNft(id: string, userId: string, userRole: 'user' | 'admin'): Promise<boolean> {
        const nft = await db.NFT.findByPk(id);
        if (!nft) {
            throw new AppError('NFT not found.', 404);
        }
        if (nft.creator_id !== userId && userRole !== 'admin') {
             throw new AppError('Not authorized to delete this NFT.', 403);
        }
        await nft.destroy();
        return true;
    }

    async placeBid(nftId: string, userId: string, amount: number): Promise<any> { // Replace 'any' with BidInstance when Bid model is typed
        console.log(`NftService.placeBid called for NFT ID: ${nftId} by User: ${userId} with Amount: ${amount}`);
        // --- TODO: Implement actual bid placement logic with Bid model ---
        // 1. Find NFT, check auction status and end time.
        // 2. Validate bid amount (e.g., > current highest bid or starting bid).
        // 3. Create a new Bid record.
        // 4. Potentially update NFT's highest_bid_id or current_price.
        // This can be complex and might involve database transactions.
        return { bid_id: 'mock_bid_' + Date.now(), nft_id: nftId, user_id: userId, amount, bid_time: new Date().toISOString(), status: 'success_mocked' };
    }
    
    async updateNftStatusByAdmin(nftId: string, status: NftStatusType): Promise<NFTInstance | null> {
        const nft = await db.NFT.findByPk(nftId);
        if (!nft) {
            throw new AppError('NFT not found.', 404);
        }
        await nft.update({ status });
        return nft.reload();
    }
}

export default new NftService();
