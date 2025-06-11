
'use client';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit3, Settings, LayoutGrid, Heart, History, Activity as ActivityIconComponent, UserCircle, 
  ShoppingCart, Tag, PackagePlus, HandCoins, ListChecks, Flame, Gavel, FileText, UserPlus, TrendingUp, CircleDollarSign, Loader2, Frown, AlertTriangle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
// Removed: import { GraphQLClient, gql } from 'graphql-request';
import { Skeleton } from '@/components/ui/skeleton';

// --- GraphQL Related (Placeholder/Mock Data Usage) ---
// Removed: const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
// Removed: const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

const MOCK_USER_ID = "user_creative_123"; 

// Removed: GraphQL query definitions (GET_USER_OWNED_NFTS_QUERY, etc.)
// They were not being used as the actual fetch calls were commented out.

// Mock data simulating what would have been fetched
const mockOwnedNftsFromGraphQL: NFTCardProps[] = [
  { id: 'gql_owned1', imageUrl: 'https://placehold.co/300x300.png', title: 'GQL Owned Abstract #1', price: 'Purchased for 0.5 ETH', artistName: 'UserCreative', dataAiHint:"abstract art" },
  { id: 'gql_owned2', imageUrl: 'https://placehold.co/300x300.png', title: 'My GQL Cyber Pet', price: 'Purchased for 1.2 ETH', artistName: 'UserCreative', dataAiHint:"cyberpunk animal" },
];

const mockFavoritedNftsFromGraphQL: NFTCardProps[] = [
  { id: 'gql_fav1', imageUrl: 'https://placehold.co/300x300.png', title: 'GQL Pixelated Serenity', price: '0.8 ETH', artistName: '8BitWonder', dataAiHint:"pixel art" },
];

interface TransactionGQL { // Kept interface for mock data structure
    id: string;
    type: 'Purchase' | 'Sale' | 'Mint' | 'Bid_Placed' | 'Bid_Received' | 'Listing';
    item: string;
    amount: string;
    date: string; 
    status: 'Completed' | 'Pending' | 'Failed';
}

const mockTransactionHistoryFromGraphQL: TransactionGQL[] = [
    { id: 't1', type: 'Purchase', item: 'Cosmic Explorer GQL', amount: '3.0 ETH', date: '2023-10-15T10:00:00Z', status: 'Completed' },
    { id: 't2', type: 'Sale', item: 'My Old Artwork GQL', amount: '0.5 ETH', date: '2023-09-20T14:30:00Z', status: 'Completed' },
    { id: 't3', type: 'Mint', item: 'Digital Landscape GQL', amount: '0.02 ETH (Gas)', date: '2023-08-01T11:00:00Z', status: 'Completed' },
];

interface ActivityItemGQL { // Kept interface for mock data structure
  id: string;
  iconName: 'PackagePlus' | 'Tag' | 'HandCoins' | 'Heart' | 'ShoppingCart' | 'UserPlus';
  message: string;
  timestamp: string; 
  href?: string;
}
const mockRecentActivityFromGraphQL: ActivityItemGQL[] = [
  { id: 'ra1', iconName: 'PackagePlus', message: "You minted 'Cyber Sunrise GQL'", timestamp: '2023-11-10T10:00:00Z', href: '/nft/owned3' },
  { id: 'ra2', iconName: 'Tag', message: "You listed 'Neon Dreams GQL' for 1.2 ETH", timestamp: '2023-11-10T05:00:00Z', href: '/nft/1' },
  { id: 'ra3', iconName: 'Heart', message: "You favorited 'Galaxy Bloom GQL'", timestamp: '2023-11-08T00:00:00Z', href: '/nft/r1'},
];

// --- END Mock Data Section ---

const userItemsForSaleCount = 5;
const userTotalEarnings = "12.5 ETH";

interface Transaction extends TransactionGQL {
    icon: LucideIcon;
}
interface ActivityItem extends ActivityItemGQL {
  icon: LucideIcon;
}

const iconMap: Record<string, LucideIcon> = {
  Purchase: ShoppingCart,
  Sale: Tag,
  Mint: PackagePlus,
  Bid_Placed: Gavel,
  Bid_Received: HandCoins,
  Listing: FileText,
  PackagePlus: PackagePlus,
  HandCoins: HandCoins,
  Heart: Heart,
  ShoppingCart: ShoppingCart,
  UserPlus: UserPlus,
  Default: ActivityIconComponent, 
};


const LoadingNFTSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => (
      <Card key={i} className="shadow-lg">
        <Skeleton className="aspect-square w-full bg-muted" />
        <CardContent className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2 bg-muted" />
          <Skeleton className="h-4 w-1/2 mb-3 bg-muted" />
          <Skeleton className="h-6 w-1/3 bg-muted" />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Skeleton className="h-9 w-full bg-muted" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

const LoadingListSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
            <Card key={i} className="p-3 sm:p-4">
                <div className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-muted mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-3/4 bg-muted" />
                        <Skeleton className="h-3 w-1/2 bg-muted" />
                    </div>
                    <Skeleton className="h-6 w-20 bg-muted" />
                </div>
            </Card>
        ))}
    </div>
);


const EmptyState = ({ icon: Icon, title, message, ctaLink, ctaText }: { icon: LucideIcon, title: string, message: string, ctaLink?: string, ctaText?: string }) => (
  <Card className="text-center py-12 border-dashed">
    <CardContent className="flex flex-col items-center">
        <Icon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1">{message}</p>
        {ctaLink && ctaText && <Button className="mt-4" asChild><Link href={ctaLink}>{ctaText}</Link></Button>}
    </CardContent>
  </Card>
);

const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <Card className="text-center py-12 border-destructive bg-destructive/10">
    <CardContent className="flex flex-col items-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold text-destructive">Could not load data</h3>
      <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
      {onRetry && <Button variant="destructive" className="mt-6" onClick={onRetry}>Try Again</Button>}
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const [ownedNfts, setOwnedNfts] = useState<NFTCardProps[]>([]);
  const [isLoadingOwned, setIsLoadingOwned] = useState(true);
  const [errorOwned, setErrorOwned] = useState<string | null>(null);

  const [favoritedNfts, setFavoritedNfts] = useState<NFTCardProps[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [errorFavorites, setErrorFavorites] = useState<string | null>(null);

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [errorActivity, setErrorActivity] = useState<string | null>(null);


  const fetchOwnedNfts = async () => {
    setIsLoadingOwned(true);
    setErrorOwned(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call to your Node.js backend
      // Example: const response = await fetch(`/api/users/${MOCK_USER_ID}/owned-nfts`);
      // const data = await response.json();
      // setOwnedNfts(data.nfts);
      setOwnedNfts(mockOwnedNftsFromGraphQL); 
    } catch (err) {
      console.error("Failed to fetch owned NFTs:", err);
      let message = "An unknown error occurred.";
      if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
        message = "Could not connect to the server. Please ensure the backend server is running or check your network.";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorOwned(message);
    } finally {
      setIsLoadingOwned(false);
    }
  };

  const fetchFavoritedNfts = async () => {
    setIsLoadingFavorites(true);
    setErrorFavorites(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      // Replace with actual API call
      setFavoritedNfts(mockFavoritedNftsFromGraphQL); 
    } catch (err) {
      console.error("Failed to fetch favorited NFTs:", err);
      let message = "An unknown error occurred.";
       if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
        message = "Could not connect to the server. Please ensure the backend server is running or check your network.";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorFavorites(message);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const fetchTransactionHistory = async () => {
    setIsLoadingHistory(true);
    setErrorHistory(null);
    try {
        await new Promise(resolve => setTimeout(resolve, 800)); 
        // Replace with actual API call
        const transformedHistory = mockTransactionHistoryFromGraphQL.map(tx => ({
            ...tx,
            icon: iconMap[tx.type] || iconMap.Default,
        }));
        setTransactionHistory(transformedHistory);
    } catch (err) {
        console.error("Failed to fetch transaction history:", err);
        let message = "An unknown error occurred.";
        if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
            message = "Could not connect to the server for history. Please ensure the backend server is running or check your network.";
        } else if (err instanceof Error) {
            message = err.message;
        }
        setErrorHistory(message);
    } finally {
        setIsLoadingHistory(false);
    }
  };

  const fetchRecentActivity = async () => {
    setIsLoadingActivity(true);
    setErrorActivity(null);
    try {
        await new Promise(resolve => setTimeout(resolve, 900)); 
        // Replace with actual API call
        const transformedActivity = mockRecentActivityFromGraphQL.map(act => ({
            ...act,
            icon: iconMap[act.iconName] || iconMap.Default,
        }));
        setRecentActivity(transformedActivity);
    } catch (err) {
        console.error("Failed to fetch recent activity:", err);
        let message = "An unknown error occurred.";
        if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
            message = "Could not connect to the server for activity. Please ensure the backend server is running or check your network.";
        } else if (err instanceof Error) {
            message = err.message;
        }
        setErrorActivity(message);
    } finally {
        setIsLoadingActivity(false);
    }
  };
  
  useEffect(() => {
    fetchOwnedNfts();
    fetchFavoritedNfts();
    fetchTransactionHistory();
    fetchRecentActivity();
  }, []);


  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card className="mb-8 shadow-xl overflow-hidden border-border">
          <div className="bg-muted/20 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Image 
                src="https://placehold.co/120x120.png" 
                alt="User Profile" 
                width={120} 
                height={120} 
                className="rounded-full border-4 border-card shadow-md object-cover"
                data-ai-hint="profile avatar"
              />
              <div className="text-center sm:text-left flex-grow">
                <CardTitle className="text-3xl font-bold font-headline">CreativeUser123</CardTitle>
                <CardDescription className="text-md mt-1">
                  Passionate digital art collector and aspiring generative artist. Exploring the frontiers of web3 creativity. Joined 2023.
                </CardDescription>
                <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                  <Button variant="default" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings"><Settings className="h-4 w-4 mr-2" /> Settings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CardFooter className="p-4 bg-card border-t grid grid-cols-2 gap-4 text-center text-sm sm:grid-cols-4 sm:gap-2">
            <div>
                <p className="font-semibold text-lg text-primary">{isLoadingOwned ? <Loader2 className="h-5 w-5 animate-spin inline"/> : ownedNfts.length}</p>
                <p className="text-muted-foreground">NFTs Owned</p>
            </div>
            <div>
                <p className="font-semibold text-lg text-primary">{isLoadingFavorites ? <Loader2 className="h-5 w-5 animate-spin inline"/> : favoritedNfts.length}</p>
                <p className="text-muted-foreground">Favorites</p>
            </div>
            <div>
                <p className="font-semibold text-lg text-primary">{isLoadingHistory ? <Loader2 className="h-5 w-5 animate-spin inline"/> : userItemsForSaleCount}</p>
                <p className="text-muted-foreground">Items for Sale</p>
            </div>
             <div>
                <p className="font-semibold text-lg text-primary">{userTotalEarnings}</p>
                <p className="text-muted-foreground">Total Earnings</p>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="mb-8 shadow-lg border-border">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><ActivityIconComponent className="mr-2 h-5 w-5 text-primary" />Platform Updates & Announcements</CardTitle>
                <CardDescription>Latest news and important information from the ArtNFT team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg bg-muted/50 flex items-start space-x-3">
                    <div className="p-1.5 bg-primary/20 rounded-full mt-0.5"><Flame className="h-4 w-4 text-primary" /></div>
                    <div>
                        <p className="font-medium text-sm">Important: Platform Maintenance Scheduled</p>
                        <p className="text-xs text-muted-foreground">Brief downtime expected on Nov 20, 2 AM UTC for system upgrades.</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Posted: 2 days ago</p>
                    </div>
                </div>
                 <div className="p-3 border rounded-lg bg-muted/50 flex items-start space-x-3">
                    <div className="p-1.5 bg-accent/20 rounded-full mt-0.5"><FileText className="h-4 w-4 text-accent" /></div>
                    <div>
                        <p className="font-medium text-sm">New Feature: Advanced Search Filters!</p>
                        <p className="text-xs text-muted-foreground">Find exactly what you're looking for with new filtering options.</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Posted: 1 week ago</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50">
            <TabsTrigger value="owned"><LayoutGrid className="h-4 w-4 mr-2" /> <span className="truncate">Owned NFTs</span></TabsTrigger>
            <TabsTrigger value="favorites"><Heart className="h-4 w-4 mr-2" /> <span className="truncate">Favorites</span></TabsTrigger>
            <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> <span className="truncate">History</span></TabsTrigger>
            <TabsTrigger value="activity"><ActivityIconComponent className="h-4 w-4 mr-2" /> <span className="truncate">Activity</span></TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            {isLoadingOwned ? (
              <LoadingNFTSkeleton />
            ) : errorOwned ? (
              <ErrorState message={errorOwned} onRetry={fetchOwnedNfts} />
            ) : ownedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : (
              <EmptyState 
                icon={LayoutGrid} 
                title="No NFTs Owned Yet" 
                message="Start exploring the marketplace to find your first NFT!" 
                ctaLink="/home" 
                ctaText="Explore Marketplace" 
              />
            )}
          </TabsContent>

          <TabsContent value="favorites">
             {isLoadingFavorites ? (
              <LoadingNFTSkeleton />
            ) : errorFavorites ? (
              <ErrorState message={errorFavorites} onRetry={fetchFavoritedNfts} />
            ) : favoritedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : (
              <EmptyState 
                icon={Heart}
                title="No Favorites Yet"
                message="Mark NFTs you love by clicking the heart icon."
                ctaLink="/home"
                ctaText="Explore Marketplace"
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Overview of your past activities on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingHistory ? (
                        <LoadingListSkeleton count={3}/>
                    ) : errorHistory ? (
                        <ErrorState message={errorHistory} onRetry={fetchTransactionHistory} />
                    ) : transactionHistory.length > 0 ? (
                        <ul className="divide-y divide-border">
                            {transactionHistory.map(tx => {
                                const isIncome = tx.type === 'Sale' || tx.type === 'Bid_Received';
                                const isExpense = tx.type === 'Purchase' || tx.type === 'Mint' || tx.type === 'Bid_Placed';
                                const amountColor = isIncome 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : isExpense 
                                    ? 'text-red-600 dark:text-red-400' 
                                    : 'text-foreground';
                                return (
                                <li key={tx.id} className="p-3 sm:p-4 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <div className={cn(`p-2 rounded-full mt-0.5 bg-muted`)}>
                                            <tx.icon className={cn(`h-5 w-5 text-muted-foreground`)} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                                <div className="mb-1 sm:mb-0">
                                                    <p className="font-semibold text-sm sm:text-base">{tx.type.replace('_', ' ')}: <span className="text-primary">{tx.item}</span></p>
                                                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <div className="flex flex-col sm:items-end gap-1">
                                                    <p className={cn(`font-medium text-sm`, amountColor)}>
                                                        {isIncome ? '+' : (isExpense && tx.type !== 'Listing') ? '-' : ''} {tx.amount}
                                                    </p>
                                                    <Badge variant={
                                                        tx.status === 'Completed' ? 'default' : 
                                                        tx.status === 'Pending' ? 'secondary' : 
                                                        'destructive'
                                                      } className={cn(`text-xs`, 
                                                        tx.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                                                        tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 
                                                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' )}>
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <EmptyState 
                            icon={History}
                            title="No Transaction History"
                            message="Your transactions will appear here once you start buying, selling, or minting NFTs."
                        />
                     )}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A feed of your recent actions and important events.</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoadingActivity ? (
                    <LoadingListSkeleton count={4} />
                ) : errorActivity ? (
                    <ErrorState message={errorActivity} onRetry={fetchRecentActivity} />
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map(item => {
                      const ActivityWrapper = item.href ? Link : 'div';
                      const wrapperProps = item.href ? { href: item.href } : {};
                      return (
                        <ActivityWrapper
                          key={item.id}
                          {...wrapperProps}
                          className={cn(
                            `rounded-lg border flex items-start transition-colors p-3 space-x-3 sm:p-4 sm:space-x-4 bg-card`,
                            item.href ? 'cursor-pointer hover:bg-muted/20 block' : 'block'
                          )}
                        >
                          <div className="p-2.5 rounded-full mt-0.5 bg-primary/10">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{item.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                          </div>
                        </ActivityWrapper>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState 
                    icon={ListChecks}
                    title="No Recent Activity"
                    message="Your recent actions on the platform will show up here."
                    ctaLink="/home"
                    ctaText="Start Exploring"
                  />
                )}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
    
    

    


