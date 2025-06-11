
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
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Simulated "owned" NFTs for the test user
const testUserOwnedNfts: NFTCardProps[] = [
  { id: 'owned_test1', imageUrl: 'https://placehold.co/300x300.png', title: 'My Cosmic Test NFT', price: '0.75 ETH', artistName: 'testuser@artnft.com', dataAiHint:"abstract space" },
  { id: 'owned_test2', imageUrl: 'https://placehold.co/300x300.png', title: 'Pixelated Test Token', price: '0.25 ETH', artistName: 'testuser@artnft.com', dataAiHint:"pixel token" },
];
// Default mock owned NFTs for other users or if no specific user is matched
const defaultMockOwnedNftsData: NFTCardProps[] = [
  { id: 'owned_default1', imageUrl: 'https://placehold.co/300x300.png', title: 'My Abstract #1', price: 'Purchased for 0.5 ETH', artistName: 'UserCreative', dataAiHint:"abstract art" },
];

const mockFavoritedNftsData: NFTCardProps[] = [
  { id: 'fav1', imageUrl: 'https://placehold.co/300x300.png', title: 'Pixelated Serenity', price: '0.8 ETH', artistName: '8BitWonder', dataAiHint:"pixel art" },
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

const mockTransactionHistoryData: Transaction[] = [
    { id: 't1', type: 'Purchase', item: 'Cosmic Explorer', amount: '3.0 ETH', date: '2023-10-15T10:00:00Z', status: 'Completed', icon: ShoppingCart },
    { id: 't2', type: 'Sale', item: 'My Old Artwork', amount: '0.5 ETH', date: '2023-09-20T14:30:00Z', status: 'Completed', icon: Tag },
];

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  message: string;
  timestamp: string; 
  href?: string;
}
const mockRecentActivityData: ActivityItem[] = [
  { id: 'ra1', icon: PackagePlus, message: "You minted 'Cyber Sunrise'", timestamp: '2023-11-10T10:00:00Z', href: '/nft/owned3' },
  { id: 'ra3', icon: Heart, message: "You favorited 'Galaxy Bloom'", timestamp: '2023-11-08T00:00:00Z', href: '/nft/r1'},
];

const userItemsForSaleCount = 5; 
const userTotalEarnings = "12.5 ETH"; 

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
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
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

  const fetchUserAndData = async () => {
    setIsLoadingUser(true);
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !currentUser) {
      // toast({ variant: "destructive", title: "Authentication Error", description: "Could not fetch user session. Please log in."});
      router.push('/login'); // Redirect if not logged in
      setIsLoadingUser(false);
      return;
    }
    setUser(currentUser);
    setIsLoadingUser(false);

    fetchOwnedNfts(currentUser);
    fetchFavoritedNfts(currentUser.id);
    fetchTransactionHistory(currentUser.id);
    fetchRecentActivity(currentUser.id);
  };
  
  useEffect(() => {
    fetchUserAndData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const newCurrentUser = session?.user ?? null;
      setUser(newCurrentUser);
      if (event === 'SIGNED_OUT' || !newCurrentUser) {
        router.push('/login');
      } else if (event === 'SIGNED_IN' && newCurrentUser) {
        fetchOwnedNfts(newCurrentUser);
        fetchFavoritedNfts(newCurrentUser.id);
        fetchTransactionHistory(newCurrentUser.id);
        fetchRecentActivity(newCurrentUser.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);


  const fetchOwnedNfts = async (currentUser: User) => {
    setIsLoadingOwned(true); setErrorOwned(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      // SIMULATION: Check if the logged-in user is 'testuser@artnft.com'
      if (currentUser.email === 'testuser@artnft.com') {
        setOwnedNfts(testUserOwnedNfts);
      } else {
        // For any other user, show default mock data or an empty array
        setOwnedNfts(defaultMockOwnedNftsData); 
        // Or setOwnedNfts([]); to show empty state for other users
      }
    } catch (err) { setErrorOwned("Failed to fetch owned NFTs."); } finally { setIsLoadingOwned(false); }
  };

  const fetchFavoritedNfts = async (userId: string) => {
    setIsLoadingFavorites(true); setErrorFavorites(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      setFavoritedNfts(mockFavoritedNftsData);
    } catch (err) { setErrorFavorites("Failed to fetch favorited NFTs."); } finally { setIsLoadingFavorites(false); }
  };

  const fetchTransactionHistory = async (userId: string) => {
    setIsLoadingHistory(true); setErrorHistory(null);
    try {
        await new Promise(resolve => setTimeout(resolve, 600));
        setTransactionHistory(mockTransactionHistoryData);
    } catch (err) { setErrorHistory("Failed to fetch transaction history."); } finally { setIsLoadingHistory(false); }
  };

  const fetchRecentActivity = async (userId: string) => {
    setIsLoadingActivity(true); setErrorActivity(null);
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setRecentActivity(mockRecentActivityData);
    } catch (err) { setErrorActivity("Failed to fetch recent activity."); } finally { setIsLoadingActivity(false); }
  };

  const profileDisplayName = user?.email ? (user.user_metadata?.username || user.email.split('@')[0]) : (isLoadingUser ? 'Loading...' : 'User');
  const profileBio = user?.user_metadata?.bio || "Digital art enthusiast. Exploring web3.";
  const profileAvatar = user?.user_metadata?.avatar_url || `https://placehold.co/120x120.png?text=${profileDisplayName.charAt(0).toUpperCase()}`;


  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {isLoadingUser ? (
           <Card className="mb-8 shadow-xl overflow-hidden border-border animate-pulse">
             <div className="bg-muted/20 p-6 md:p-8"><Skeleton className="h-24 w-full"/></div>
             <CardFooter className="p-4 bg-card border-t grid grid-cols-2 gap-4 text-center text-sm sm:grid-cols-4 sm:gap-2">
                {[...Array(4)].map((_,i) => <div key={i}><Skeleton className="h-5 w-12 mx-auto"/><Skeleton className="h-4 w-20 mx-auto mt-1"/></div>)}
             </CardFooter>
           </Card>
        ) : user ? (
            <Card className="mb-8 shadow-xl overflow-hidden border-border">
            <div className="bg-muted/20 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Image 
                    src={profileAvatar}
                    alt="User Profile" 
                    width={120} 
                    height={120} 
                    className="rounded-full border-4 border-card shadow-md object-cover"
                    data-ai-hint="profile avatar"
                />
                <div className="text-center sm:text-left flex-grow">
                    <CardTitle className="text-3xl font-bold font-headline">{profileDisplayName}</CardTitle>
                    <CardDescription className="text-md mt-1">{profileBio}</CardDescription>
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
                    <p className="font-semibold text-lg text-primary">{userItemsForSaleCount}</p>
                    <p className="text-muted-foreground">Items for Sale</p>
                </div>
                <div>
                    <p className="font-semibold text-lg text-primary">{userTotalEarnings}</p>
                    <p className="text-muted-foreground">Total Earnings</p>
                </div>
            </CardFooter>
            </Card>
        ) : (
            <ErrorState message="User session not found. Please log in." onRetry={() => router.push('/login')} />
        )}
        
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
              <ErrorState message={errorOwned} onRetry={() => user && fetchOwnedNfts(user)} />
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
              <ErrorState message={errorFavorites} onRetry={() => user && fetchFavoritedNfts(user.id)} />
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
                        <ErrorState message={errorHistory} onRetry={() => user && fetchTransactionHistory(user.id)} />
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
                    <ErrorState message={errorActivity} onRetry={() => user && fetchRecentActivity(user.id)} />
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
