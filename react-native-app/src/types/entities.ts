
// react-native-app/src/types/entities.ts
// Define or import types for User, NFT, Collection, Offer etc.
// These should mirror your web app's `src/types/entities.ts` as closely as possible,
// adapting where necessary for mobile-specific needs or if backend DTOs differ.

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin',
}

export enum NftListingType {
  FIXED_PRICE = 'fixed_price',
  TIMED_AUCTION = 'timed_auction',
  OPEN_AUCTION = 'open_auction',
}

// Add other enums like OfferStatus, TransactionType as needed from your web types

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
  createdAt: string | Date; // string if from API, Date if converted
}

export interface NftProperty {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface Nft {
  id: string;
  slug?: string;
  title: string;
  imageUrl: string;
  description?: string;
  price?: number; // Store as number for calculations
  currency?: string;
  creator?: Pick<User, 'id' | 'username' | 'avatarUrl'>; // Nested creator info
  owner?: Pick<User, 'id' | 'username' | 'avatarUrl'>; // Nested owner info
  collectionId?: string;
  collectionName?: string; // Often useful to have directly
  properties?: NftProperty[];
  isListedForSale: boolean;
  listingType?: NftListingType;
  // Add other fields as per your web app's Nft type (favoritesCount, views, etc.)
  favoritesCount?: number;
  views?: number;
}

export interface Collection {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  logoImageUrl?: string;
  creator?: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  itemCount?: number;
  volumeTraded?: number;
  floorPrice?: number;
  // ... other fields
}

export interface Offer {
    id: string;
    nftId: string;
    nft?: Partial<Nft>; // Include partial NFT details
    offererId: string;
    offerer?: Partial<User>;
    offerAmount: number;
    currency: string;
    status: string; // e.g., 'pending', 'accepted', 'rejected'
    expiresAt?: string | Date;
    createdAt: string | Date;
}


// Add other entity types like ActivityItem, Transaction as needed

    