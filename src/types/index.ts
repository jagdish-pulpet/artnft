
export interface NFTOwner {
  owner: string;
  date: string;
  price?: number;
}

export interface NFT {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  artist: string;
  artStyle: string;
  creationDate?: string;
  materialsUsed?: string;
  ownershipHistory?: NFTOwner[];
  relatedCollectionIds?: string[];
  // For GenAI recommendation output matching
  nftId?: string; // alias for id for easier mapping with AI output
}

// For GenAI personalized-nft-recommendations output
export interface RecommendedNFT {
  nftId: string;
  title: string;
  imageUrl: string;
  artist: string;
  price: number;
}

export interface NotificationItem {
  id: string;
  type: 'new_bid' | 'price_drop' | 'new_listing' | 'sale' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  link?: string; // Optional link to navigate to
  avatarUrl?: string; // Optional avatar for user-related notifications
}
