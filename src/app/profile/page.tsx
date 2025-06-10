
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// --- Updated Mock Data (to align with schema.sql for user_001_id) ---
// User ID from schema.sql for TestUser01
const loggedInUserId = 'usr_00000000-0000-0000-0000-000000000001';
// NFT IDs from schema.sql
const nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001'; // My First Abstract (owned by TestUser01)
const nft_id_002 = 'nft_00000000-0000-0000-0000-MOCK00000002'; // Pixel Pal (owned by TestUser01, auction)
const nft_id_011 = 'nft_00000000-0000-0000-0000-MOCK00000011'; // Pixel Knight #001 (sold to TestUser01)
const nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003'; // Dream Weaver #1 (favorited by TestUser01)
const nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007'; // Cybernetic Orb (favorited by TestUser01)


const mockOwnedNfts: NFTCardProps[] = [
  { id: nft_id_001, imageUrl: 'https://placehold.co/400x400.png', title: 'My First Abstract', price: '0.5 ETH', artistName: 'TestUser01', dataAiHint:"abstract art" },
  { id: nft_id_002, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Pal', price: 'On Auction', artistName: 'TestUser01', dataAiHint:"pixel character" },
  { id: nft_id_011, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Knight #001', price: 'Purchased', artistName: 'PixelPioneer', dataAiHint:"pixel knight" },
];

const mockFavoritedNfts: NFTCardProps[] = [
  { id: nft_id_003, imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver #1', price: '1.2 ETH', artistName: 'ArtIsLife', dataAiHint:"surreal landscape" },
  { id: nft_id_007, imageUrl: 'https://placehold.co/400x400.png', title: 'Cybernetic Orb', price: '2.0 ETH', artistName: 'DigitalCreatorPro', dataAiHint:"cyberpunk orb" },
];

interface Transaction {
    id: string;
    type: 'Purchase' | 'Sale' | 'Mint' | 'Bid_Placed' | 'Bid_Received' | 'Listing';
    item: string;
    amount: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
    icon: LucideIcon;
}

const mockTransactionHistory: Transaction[] = [
    { id: 'tx_buy_pixelknight', type: 'Purchase', item: 'Pixel Knight #001', amount: '0.3 ETH', date: new Date(Date.now() - 1*24*60*60*1000).toISOString(), status: 'Completed', icon: ShoppingCart }, // User 1 bought this
    { id: 'tx_mint_abstract', type: 'Mint', item: 'My First Abstract', amount: '0.02 ETH (Gas)', date: new Date(Date.now() - 7*24*60*60*1000).toISOString(), status: 'Completed', icon: PackagePlus },
];

interface ActivityItem {
  id: string;
  iconName: 'PackagePlus' | 'Tag' | 'HandCoins' | 'Heart' | 'ShoppingCart' | 'UserPlus' | 'Gavel';
  message: string;
  timestamp: string;
  href?: string;
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
  Gavel: Gavel,
  Default: ActivityIconComponent,
};

const mockRecentActivity: ActivityItem[] = [
  { id: 'ra1', iconName: 'PackagePlus', message: "You minted 'My First Abstract'", timestamp: new Date(Date.now() - 7*24*60*60*1000).toISOString(), href: `/nft/${nft_id_001}`, icon: PackagePlus },
  { id: 'ra2', iconName: 'Heart', message: "You favorited 'Dream Weaver #1'", timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), href: `/nft/${nft_id_003}`, icon: Heart },
  { id: 'ra3', iconName: 'ShoppingCart', message: "You purchased 'Pixel Knight #001'", timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), href: `/nft/${nft_id_011}`, icon: ShoppingCart },
  { id: 'ra4', iconName: 'Gavel', message: "You placed a bid on 'Pixel Dragonling'", timestamp: new Date(Date.now() - 10*60*1000).toISOString(), href: `/nft/nft_00000000-0000-0000-0000-MOCK00000013`, icon: Gavel }, // Assuming User 1 bid on Pixel Dragonling
];

const userItemsForSaleCount = mockOwnedNfts.filter(nft => nft.price !== 'Purchased' && nft.price !== 'On Auction').length; // NFTs TestUser01 has listed for sale
const userTotalEarnings = "0.0 ETH"; // TestUser01 hasn't sold anything in this mock setup

interface UserProfileData {
    id: string;
    email: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
    join_date?: string;
}

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
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [ownedNfts, setOwnedNfts] = useState<NFTCardProps[]>(mockOwnedNfts);
  const [isLoadingOwned, setIsLoadingOwned] = useState(false);
  const [errorOwned, setErrorOwned] = useState<string | null>(null);

  const [favoritedNfts, setFavoritedNfts] = useState<NFTCardProps[]>(mockFavoritedNfts);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [errorFavorites, setErrorFavorites] = useState<string | null>(null);

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(mockTransactionHistory);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(mockRecentActivity);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [errorActivity, setErrorActivity] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    setErrorProfile(null);
    const token = localStorage.getItem('artnft_user_token');

    if (!token) {
        setErrorProfile("You are not logged in.");
        setIsLoadingProfile(false);
        return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch profile (${response.status})`);
      }
      const data: UserProfileData = await response.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      let message = "An unknown error occurred while fetching your profile.";
       if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
        message = "Could not connect to the server. Please ensure the backend server is running or check your network.";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorProfile(message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [editUsername, setEditUsername] = useState(userProfile?.username || '');
  const [editBio, setEditBio] = useState(userProfile?.bio || '');
  useEffect(() => {
    setEditUsername(userProfile?.username || 'TestUser01'); // Fallback to mock if profile still loading
    setEditBio(userProfile?.bio || 'Just a test user exploring ArtNFT.');
  }, [userProfile]);

  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({title: "Profile Update (Simulated)", description: "Your profile update has been submitted."});
  };


  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <Card className="mb-8 shadow-xl overflow-hidden border-border">
          <div className="bg-muted/20 p-6 md:p-8">
             {isLoadingProfile && (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Skeleton className="h-[120px] w-[120px] rounded-full border-4 border-card shadow-md" />
                    <div className="text-center sm:text-left flex-grow space-y-2">
                        <Skeleton className="h-8 w-3/4 sm:w-1/2" />
                        <Skeleton className="h-4 w-full sm:w-3/4" />
                        <Skeleton className="h-4 w-full sm:w-2/3" />
                        <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                            <Skeleton className="h-9 w-32" /> <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                </div>
            )}
            {errorProfile && !isLoadingProfile && (
                 <div className="text-center py-6">
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-2" />
                    <p className="text-destructive text-sm">Error loading profile: {errorProfile}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={fetchUserProfile}>Try Again</Button>
                 </div>
            )}
            {!isLoadingProfile && !errorProfile && userProfile && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Image
                src={userProfile.avatar_url || "https://placehold.co/120x120.png"}
                alt={userProfile.username || "User Profile"}
                width={120}
                height={120}
                className="rounded-full border-4 border-card shadow-md object-cover"
                data-ai-hint="profile avatar"
              />
              <div className="text-center sm:text-left flex-grow">
                <CardTitle className="text-3xl font-bold font-headline">{userProfile.username || userProfile.email}</CardTitle>
                <CardDescription className="text-md mt-1">
                  {userProfile.bio || "No bio yet. Tell us about yourself!"}
                </CardDescription>
                <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                  <Button variant="default" size="sm" onClick={() => toast({title: "Edit Profile Clicked", description:"Edit form would open here."})}>
                    <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings"><Settings className="h-4 w-4 mr-2" /> Settings</Link>
                  </Button>
                </div>
              </div>
            </div>
            )}
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
                <p className="font-semibold text-lg text-primary">{userItemsForSaleCount}</p>
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
                    <div className="p-1.5 bg-primary/20 rounded-full mt-0.5"><TrendingUp className="h-4 w-4 text-primary" /></div>
                    <div>
                        <p className="font-medium text-sm">New Feature: Advanced Search Filters!</p>
                        <p className="text-xs text-muted-foreground">Easily find exactly what you're looking for with our new filter options.</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Posted: 1 day ago</p>
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
              <ErrorState message={errorOwned} onRetry={() => {/* TODO: Implement fetchOwnedNfts */}} />
            ) : ownedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : (
              <EmptyState
                icon={LayoutGrid}
                title="No NFTs Owned Yet"
                message="Start exploring the marketplace to find your first NFT!"
                ctaLink="/search"
                ctaText="Explore Marketplace"
              />
            )}
          </TabsContent>

          <TabsContent value="favorites">
             {isLoadingFavorites ? (
              <LoadingNFTSkeleton />
            ) : errorFavorites ? (
              <ErrorState message={errorFavorites} onRetry={() => {/* TODO: Implement fetchFavoritedNfts */}} />
            ) : favoritedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="No Favorites Yet"
                message="Mark NFTs you love by clicking the heart icon."
                ctaLink="/search"
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
                        <ErrorState message={errorHistory} onRetry={() => {/* TODO: Implement fetchTransactionHistory */}} />
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
                    <ErrorState message={errorActivity} onRetry={() => {/* TODO: Implement fetchRecentActivity */}} />
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
                    ctaLink="/search"
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

