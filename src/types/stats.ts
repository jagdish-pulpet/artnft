
// src/types/stats.ts

export interface TradingVolumeDataPoint {
  date: string; // Format: 'YYYY-MM-DD'
  volume: number;
}

export interface TopCollectionStat {
  id: string;
  name: string;
  slug: string;
  logoImageUrl?: string;
  totalVolume: number;
  salesCount: number;
  itemCount: number;
  // Optionally include creator info if needed for display
  // creator?: { id: string; username: string; avatarUrl?: string };
}

export interface TopNftStat {
  id: string;
  title: string;
  slug?: string;
  imageUrl: string;
  collectionName?: string; // Added for display
  collectionId?: string;
  totalVolume: number;
  salesCount: number;
  // Optionally include creator/owner info
  // creator?: { id: string; username: string; avatarUrl?: string };
}

export interface LeaderboardItem {
  rank?: number; // Rank will be assigned on the frontend based on order
  userId: string;
  username: string;
  avatarUrl?: string;
  value: number; 
  valueLabel?: string; 
}

// This can be expanded if other leaderboard types are added
export type LeaderboardType = 'collectors' | 'creators';
export type LeaderboardSortBy = 'volume' | 'count'; // Simplified for now
export type LeaderboardPeriod = '7d' | '30d' | 'all';

