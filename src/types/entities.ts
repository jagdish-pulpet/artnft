
/**
 * @fileoverview Defines the core data models and schemas for the ArtNFT marketplace.
 * These interfaces represent the structure of entities like Users, NFTs, Collections, etc.
 * These types can be shared between frontend and backend if structured appropriately in a monorepo,
 * or duplicated/adapted as needed.
 */

// Enum for User Roles
export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin',
}

// Enum for NFT Listing Types
export enum NftListingType {
  FIXED_PRICE = 'fixed_price',
  TIMED_AUCTION = 'timed_auction',
  OPEN_AUCTION = 'open_auction', 
}

// Enum for Transaction Types (can be broader than just blockchain transactions)
export enum TransactionTypeEnum { 
  MINT = 'mint',
  SALE = 'sale',
  TRANSFER = 'transfer',
  LISTING = 'listing',
  DELISTING = 'delisting',
  OFFER_MADE = 'offer_made',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_CANCELLED = 'offer_cancelled',
  AUCTION_BID = 'auction_bid',
}

// Enum for Offer Status
export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  WITHDRAWN = 'withdrawn',
}

// Enum for Report Status
export enum ReportStatus {
  PENDING_REVIEW = 'pending_review',
  ACTION_TAKEN = 'action_taken',
  DISMISSED = 'dismissed',
  RESOLVED = 'resolved',
}

// Enum for Reported Item Types
export enum ReportedItemType {
  NFT = 'nft',
  USER = 'user',
  COLLECTION = 'collection',
  COMMENT = 'comment', 
}

// Enum for Admin NFT Review Status
export enum AdminNftReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Enum for Activity Types (matches backend ActivityType)
export enum ActivityTypeEnum {
  NFT_CREATE = 'nft_create',
  NFT_LIST = 'nft_list',
  NFT_DELIST = 'nft_delist',
  NFT_SALE = 'nft_sale',
  NFT_TRANSFER = 'nft_transfer',
  NFT_FAVORITE_ADD = 'nft_favorite_add',
  NFT_FAVORITE_REMOVE = 'nft_favorite_remove',
  NFT_BID_PLACE = 'nft_bid_place',
  NFT_AUCTION_END = 'nft_auction_end',
  COLLECTION_CREATE = 'collection_create',
  COLLECTION_UPDATE = 'collection_update',
  OFFER_MAKE = 'offer_make',
  OFFER_ACCEPT = 'offer_accept',
  OFFER_REJECT = 'offer_reject',
  OFFER_CANCEL = 'offer_cancel',
  USER_PROFILE_UPDATE = 'user_profile_update',
  USER_FOLLOW = 'user_follow', 
  USER_UNFOLLOW = 'user_unfollow', 
  ADMIN_ACTION_USER_SUSPEND = 'admin_action_user_suspend',
  ADMIN_ACTION_NFT_VERIFY = 'admin_action_nft_verify',
  ADMIN_ACTION_NFT_DELETE = 'admin_action_nft_delete',
  ADMIN_ACTION_COLLECTION_VERIFY = 'admin_action_collection_verify',
  ADMIN_ACTION_COLLECTION_DELETE = 'admin_action_collection_delete',
  ADMIN_ACTION_REPORT_UPDATE = 'admin_action_report_update',
}


/**
 * Represents a user in the marketplace.
 */
export interface User {
  id: string; 
  username: string; 
  email?: string; 
  walletAddress: string; 
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    discord?: string;
  };
  isEmailVerified?: boolean; 
  isWalletVerified?: boolean; 
  roles: UserRole[];
  isSuspended?: boolean; 
  lastLoginAt?: Date | string; 
  createdAt: Date | string; 
  updatedAt: Date | string; 
}

/**
 * Represents a Non-Fungible Token (NFT).
 */
export interface NftProperty {
  trait_type: string;
  value: string | number;
  display_type?: 'string' | 'number' | 'date' | 'boost_percentage' | 'boost_number'; 
  max_value?: number; 
}

export interface Nft {
  id: string; 
  slug?: string; 
  tokenId?: string; 
  contractAddress?: string; 
  title: string;
  description?: string;
  imageUrl: string; 
  mediaUrl?: string; 
  mediaType?: string; 
  animationUrl?: string; 
  externalUrl?: string; 
  
  creatorId: string; 
  creator: Pick<User, 'id' | 'username' | 'avatarUrl'>; 

  ownerId: string; 
  owner: Pick<User, 'id' | 'username' | 'avatarUrl' | 'walletAddress'>; 

  collectionId?: string; 
  collection?: Pick<Collection, 'id' | 'name' | 'slug'>; 

  price?: number | null; 
  currency?: string | null; 
  
  isListedForSale: boolean;
  listingType?: NftListingType;
  auctionEndDate?: Date | string; 
  properties?: NftProperty[]; 
  royalties?: {
    recipientAddress: string;
    percentagePoints: number; 
  }[];
  views: number; 
  favoritesCount?: number;
  mintedAt: Date | string; 
  lastSaleAt?: Date | string | null;
  lastSalePrice?: number | null; 
  lastSaleCurrency?: string | null;

  isVerifiedByAdmin: boolean; 
  adminReviewStatus: AdminNftReviewStatus; 
  adminNotes?: string;

  createdAt: Date | string; 
  updatedAt: Date | string; 
  dataAiHint?: string; 
  offers?: Offer[]; 
}

/**
 * Represents a collection of NFTs.
 */
export interface Collection {
  id: string; 
  name: string; 
  slug: string; 
  description?: string;
  logoImageUrl?: string;
  coverImageUrl?: string;
  bannerImageUrl?: string; 
  creatorId: string; 
  creator?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  category?: string; 
  itemCount: number; 
  volumeTraded?: number; 
  floorPrice?: number; 
  isVerified: boolean; 
  isExplicit?: boolean; 
  externalLinks?: {
    website?: string;
    discord?: string;
    twitter?: string;
    telegram?: string;
    medium?: string;
  };
  adminNotes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  dataAiHint?: string; 
  nfts?: Nft[]; 
}

/**
 * Represents an activity item for the user feed.
 */
export interface UserActivityItem {
  id: string;
  type: ActivityTypeEnum;
  user: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  relatedNftId?: string;
  relatedNft?: Partial<Pick<Nft, 'id' | 'title' | 'slug' | 'imageUrl'>>; 
  relatedCollectionId?: string;
  relatedCollection?: Partial<Pick<Collection, 'id' | 'name' | 'slug'>>; 
  relatedOfferId?: string;
  relatedOffer?: Partial<Pick<Offer, 'id' | 'offerAmount' | 'currency'>>;
  relatedUserId?: string; 
  relatedUser?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  details?: Record<string, any>; 
  timestamp: string | Date;
}

/**
 * Interface for an NFT activity item (often similar to UserActivityItem but focused on an NFT context).
 */
export interface NftActivityItem {
    id: string;
    type: ActivityTypeEnum; 
    user: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
    relatedUser?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
    relatedOffer?: Partial<Pick<Offer, 'id' | 'offerAmount' | 'currency'>>;
    details?: {
        price?: number;
        currency?: string;
        from?: string; 
        to?: string;   
        offerAmount?: number;
        [key: string]: any; 
    };
    timestamp: string | Date;
    transactionType?: string; 
    price?: string; 
    fromUser?: Pick<User, 'id' | 'username'>; 
    toUser?: Pick<User, 'id' | 'username'>;   
    blockchainTransactionHash?: string; 
}


/**
 * Represents a transaction on the marketplace or blockchain.
 */
export interface Transaction {
  id: string; 
  nftId?: string; 
  collectionId?: string; 
  transactionType: TransactionTypeEnum; 
  fromUserId?: string; 
  toUserId?: string; 
  price?: number; 
  currency?: string; 
  blockchainTransactionHash?: string; 
  gasFee?: number; 
  platformFee?: number; 
  timestamp: Date | string; 
  status: 'pending' | 'confirmed' | 'failed' | 'processing';
  details?: Record<string, any>; 
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Represents an offer made by a user on an NFT.
 */
export interface Offer {
  id: string; 
  nftId: string; 
  nft?: Partial<Pick<Nft, 'id' | 'title' | 'imageUrl' | 'slug' | 'ownerId' | 'currency'>>; 
  offererId: string; 
  offerer?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  ownerIdAtOffer: string; 
  ownerAtOffer?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  offerAmount: number; 
  currency: string; 
  status: OfferStatus;
  expiresAt?: Date | string; 
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Represents a report submitted by a user.
 */
export interface Report {
  id: string; 
  reporterId: string; 
  reporter?: Pick<User, 'id' | 'username' | 'avatarUrl'>; 
  reportedItemId: string; 
  reportedItemType: ReportedItemType;
  reason: string; 
  details?: string; 
  status: ReportStatus;
  adminNotes?: string; 
  resolvedByUserId?: string; 
  resolvedByUser?: Pick<User, 'id' | 'username'>; 
  resolvedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Represents a file in cloud storage.
 */
export interface StorageFile {
  name: string; 
  path: string; 
  size: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
  publicUrl: string;
  generation?: string;
  metadata?: Record<string, any>;
}

export interface PaginatedStorageFilesResponse {
  files: StorageFile[];
  nextPageToken?: string;
}

export interface StorageBucketMetadata {
  bucketName: string;
}


// For API responses that include pagination metadata
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
