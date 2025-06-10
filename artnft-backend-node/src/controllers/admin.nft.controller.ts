
// src/controllers/admin.nft.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import nftService from '../services/nft.service';
import AppError from '../utils/AppError';
import type { NftStatusType } from '../models/NFT.model';

export const updateNftStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: nftId } = req.params;
        const { status } = req.body as { status: NftStatusType }; 

        if (!status) {
            return next(new AppError('Status is required.', 400));
        }
        // TODO: Add validation for allowed status values, e.g., using an array
        const allowedStatuses: NftStatusType[] = ['pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft'];
        if (!allowedStatuses.includes(status)) {
            return next(new AppError(`Invalid status value. Allowed statuses are: ${allowedStatuses.join(', ')}.`, 400));
        }

        const updatedNft = await nftService.updateNftStatusByAdmin(nftId, status); 
        
        res.status(200).json({ message: `NFT ${nftId} status updated to ${status} by admin.`, nft: updatedNft });
    } catch (error) {
        next(error);
    }
};
