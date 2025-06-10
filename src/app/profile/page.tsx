
'use client';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Edit3, Settings, LayoutGrid, Heart, History, Activity as ActivityIconComponent, UserCircle, LogOut,
  ShoppingCart, Tag, PackagePlus, HandCoins, ListChecks, Flame, Gavel, FileText, UserPlus, TrendingUp, CircleDollarSign, Loader2, Frown, AlertTriangle, Save
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect, type FormEvent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Added this import

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// --- Updated Mock Data (to align with schema.sql for user_001_id) ---
const loggedInUserId = 'usr_00000000-0000-0000-0000-000000000001';
const nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001';
const nft_id_002 = 'nft_00000000-0000-0000-0000-MOCK00000002';
const nft_id_011 = 'nft_00000000-0000-0000-0000-MOCK00000011';
const nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003';
const nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007';

// Mock data for tabs other than "Owned NFTs" will remain for now
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
    { id: 'tx_buy_pixelknight', type: 'Purchase', item: 'Pixel Knight #001', amount: '0.3 ETH', date: new Date(Date.now() - 1*24*60*60*1000).toISOString(), status: 'Completed', icon: ShoppingCart },
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
  Purchase: ShoppingCart, Sale: Tag, Mint: PackagePlus, Bid_Placed: Gavel, Bid_Received: HandCoins, Listing: FileText,
  PackagePlus: PackagePlus, HandCoins: HandCoins, Heart: Heart, ShoppingCart: ShoppingCart, UserPlus: UserPlus, Gavel: Gavel, Default: ActivityIconComponent,
};

const mockRecentActivity: ActivityItem[] = [
  { id: 'ra1', iconName: 'PackagePlus', message: "You minted 'My First Abstract'", timestamp: new Date(Date.now() - 7*24*60*60*1000).toISOString(), href: `/nft/${nft_id_001}`, icon: PackagePlus },
  { id: 'ra2', iconName: 'Heart', message: "You favorited 'Dream Weaver #1'", timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), href: `/nft/${nft_id_003}`, icon: Heart },
  { id: 'ra3', iconName: 'ShoppingCart', message: "You purchased 'Pixel Knight #001'", timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), href: `/nft/${nft_id_011}`, icon: ShoppingCart },
  { id: 'ra4', iconName: 'Gavel', message: "You placed a bid on 'Pixel Dragonling'", timestamp: new Date(Date.now() - 10*60*1000).toISOString(), href: `/nft/nft_00000000-0000-0000-0000-MOCK00000013`, icon: Gavel },
];

interface UserProfileData {
    id: string;
    email: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
    join_date?: string; // Assuming this might come from backend
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
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [ownedNfts, setOwnedNfts] = useState<NFTCardProps[]>([]);
  const [isLoadingOwnedNfts, setIsLoadingOwnedNfts] = useState(true);
  const [errorOwnedNfts, setErrorOwnedNfts] = useState<string | null>(null);

  const [favoritedNfts, setFavoritedNfts] = useState<NFTCardProps[]>(mockFavoritedNfts);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false); // Mocked, so set to false
  const [errorFavorites, setErrorFavorites] = useState<string | null>(null);

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(mockTransactionHistory);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // Mocked
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(mockRecentActivity);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false); // Mocked
  const [errorActivity, setErrorActivity] = useState<string | null>(null);

  // Edit Profile Dialog State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    setErrorProfile(null);
    const token = localStorage.getItem('artnft_user_token');

    if (!token) {
        setErrorProfile("You are not logged in. Please log in to view your profile.");
        setIsLoadingProfile(false);
        toast({ variant: "destructive", title: "Not Logged In", description: "Redirecting to login..." });
        router.push('/login');
        return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.error || `Failed to fetch profile (${response.status})`);
      }
      const data: UserProfileData = await response.json();
      setUserProfile(data);
      setEditUsername(data.username || '');
      setEditBio(data.bio || '');
      setEditAvatarUrl(data.avatar_url || '');
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      let message = "An unknown error occurred while fetching your profile.";
       if (err instanceof Error && String(err.message).toLowerCase().includes("fetch")) {
        message = "Could not connect to the server. Please check your network or try again later.";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorProfile(message);
      toast({ variant: "destructive", title: "Profile Load Error", description: message });
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  const fetchOwnedNfts = async (userId: string) => {
    setIsLoadingOwnedNfts(true);
    setErrorOwnedNfts(null);
    const token = localStorage.getItem('artnft_user_token');
     if (!token) { // Should not happen if profile fetch succeeded
        setErrorOwnedNfts("Authentication token not found.");
        setIsLoadingOwnedNfts(false);
        return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/${userId}/nfts`, {
         headers: { 'Authorization': `Bearer ${token}` }, // Assuming this endpoint also needs auth
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || errorData.error || `Failed to fetch owned NFTs (${response.status})`);
      }
      const data: { data: NFTCardProps[] } = await response.json(); // Assuming backend wraps in 'data'
      setOwnedNfts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch owned NFTs:", err);
      setErrorOwnedNfts(err instanceof Error ? err.message : "Could not load your NFTs.");
    } finally {
      setIsLoadingOwnedNfts(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Add router to dependencies if it's used in fetchUserProfile for redirects

  useEffect(() => {
    if (userProfile?.id) {
      fetchOwnedNfts(userProfile.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.id]);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artnft_user_token');
      localStorage.removeItem('artnft_user_details');
    }
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/welcome');
  };

  const openEditProfileDialog = () => {
    if(userProfile){
        setEditUsername(userProfile.username || '');
        setEditBio(userProfile.bio || '');
        setEditAvatarUrl(userProfile.avatar_url || '');
    }
    setIsEditProfileOpen(true);
  };
  
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const token = localStorage.getItem('artnft_user_token');
     if (!token || !userProfile) {
        toast({ variant: "destructive", title: "Update Failed", description: "Authentication error." });
        setIsUpdatingProfile(false);
        return;
    }

    try {
        // Simulate API call
        // const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ username: editUsername, bio: editBio, avatar_url: editAvatarUrl }),
        // });
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.error || `Failed to update profile (${response.status})`);
        // }
        // const updatedProfileData = await response.json();
        // setUserProfile(updatedProfileData.user); 
        
        // Simulated update:
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedSimulatedProfile = {
            ...userProfile,
            username: editUsername,
            bio: editBio,
            avatar_url: editAvatarUrl,
        };
        setUserProfile(updatedSimulatedProfile);
        if(localStorage.getItem('artnft_user_details')) {
            localStorage.setItem('artnft_user_details', JSON.stringify(updatedSimulatedProfile));
        }


        toast({ title: "Profile Updated!", description: "Your profile has been successfully updated (Simulated)." });
        setIsEditProfileOpen(false);
    } catch (err) {
        console.error("Failed to update profile:", err);
        toast({ variant: "destructive", title: "Update Failed", description: err instanceof Error ? err.message : "Could not update profile." });
    } finally {
        setIsUpdatingProfile(false);
    }
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
                            <Skeleton className="h-9 w-[120px]" /> <Skeleton className="h-9 w-[100px]" /> <Skeleton className="h-9 w-[80px]" />
                        </div>
                    </div>
                </div>
            )}
            {errorProfile && !isLoadingProfile && (
                 <div className="text-center py-6">
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-2" />
                    <p className="text-destructive text-sm">{errorProfile}</p>
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
                  {userProfile.bio || "No bio yet. Add one by editing your profile!"}
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button variant="default" size="sm" onClick={openEditProfileDialog}>
                    <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings"><Settings className="h-4 w-4 mr-2" /> Settings</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </div>
            )}
          </div>
          <CardFooter className="p-4 bg-card border-t grid grid-cols-2 gap-4 text-center text-sm sm:grid-cols-4 sm:gap-2">
            <div>
                <p className="font-semibold text-lg text-primary">{isLoadingOwnedNfts ? <Loader2 className="h-5 w-5 animate-spin inline"/> : ownedNfts.length}</p>
                <p className="text-muted-foreground">NFTs Owned</p>
            </div>
            <div>
                <p className="font-semibold text-lg text-primary">{isLoadingFavorites ? <Loader2 className="h-5 w-5 animate-spin inline"/> : favoritedNfts.length}</p>
                <p className="text-muted-foreground">Favorites</p>
            </div>
            <div>
                <p className="font-semibold text-lg text-primary">{userProfile ? ownedNfts.filter(nft => nft.artistName === userProfile.username).length : <Loader2 className="h-5 w-5 animate-spin inline"/>}</p> {/* Dynamic based on ownedNfts if possible */}
                <p className="text-muted-foreground">Items for Sale</p>
            </div>
             <div>
                <p className="font-semibold text-lg text-primary">{"0.0 ETH"}</p> {/* Placeholder */}
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
            {isLoadingOwnedNfts ? (
              <LoadingNFTSkeleton />
            ) : errorOwnedNfts ? (
              <ErrorState message={errorOwnedNfts} onRetry={() => userProfile && fetchOwnedNfts(userProfile.id)} />
            ) : ownedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : (
              <EmptyState icon={LayoutGrid} title="No NFTs Owned Yet" message="Start exploring the marketplace to find your first NFT!" ctaLink="/search" ctaText="Explore Marketplace" />
            )}
          </TabsContent>

          <TabsContent value="favorites">
             {isLoadingFavorites ? ( <LoadingNFTSkeleton /> ) : errorFavorites ? ( <ErrorState message={errorFavorites} /> ) : favoritedNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
              </div>
            ) : ( <EmptyState icon={Heart} title="No Favorites Yet" message="Mark NFTs you love by clicking the heart icon." ctaLink="/search" ctaText="Explore Marketplace" /> )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
                <CardHeader><CardTitle>Transaction History</CardTitle><CardDescription>Overview of your past activities.</CardDescription></CardHeader>
                <CardContent className="p-0">
                    {isLoadingHistory ? (<LoadingListSkeleton count={3}/>) : errorHistory ? (<ErrorState message={errorHistory}/>) : transactionHistory.length > 0 ? (
                        <ul className="divide-y divide-border">
                            {transactionHistory.map(tx => {
                                const isIncome = tx.type === 'Sale' || tx.type === 'Bid_Received';
                                const isExpense = tx.type === 'Purchase' || tx.type === 'Mint' || tx.type === 'Bid_Placed';
                                const amountColor = isIncome ? 'text-green-600 dark:text-green-400' : isExpense ? 'text-red-600 dark:text-red-400' : 'text-foreground';
                                return (
                                <li key={tx.id} className="p-3 sm:p-4 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-start space-x-3">
                                        <div className={cn(`p-2 rounded-full mt-0.5 bg-muted`)}><tx.icon className={cn(`h-5 w-5 text-muted-foreground`)} /></div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                                <div className="mb-1 sm:mb-0">
                                                    <p className="font-semibold text-sm sm:text-base">{tx.type.replace('_', ' ')}: <span className="text-primary">{tx.item}</span></p>
                                                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <div className="flex flex-col sm:items-end gap-1">
                                                    <p className={cn(`font-medium text-sm`, amountColor)}>{isIncome ? '+' : (isExpense && tx.type !== 'Listing') ? '-' : ''} {tx.amount}</p>
                                                    <Badge variant={ tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive' } className={cn(`text-xs`, tx.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' )}>{tx.status}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (<EmptyState icon={History} title="No Transaction History" message="Your transactions will appear here." />)}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>A feed of your recent actions.</CardDescription></CardHeader>
                <CardContent>
                {isLoadingActivity ? (<LoadingListSkeleton count={4} />) : errorActivity ? (<ErrorState message={errorActivity}/>) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map(item => {
                      const ActivityWrapper = item.href ? Link : 'div';
                      const wrapperProps = item.href ? { href: item.href } : {};
                      return (
                        <ActivityWrapper key={item.id} {...wrapperProps} className={cn(`rounded-lg border flex items-start transition-colors p-3 space-x-3 sm:p-4 sm:space-x-4 bg-card`, item.href ? 'cursor-pointer hover:bg-muted/20 block' : 'block')}>
                          <div className="p-2.5 rounded-full mt-0.5 bg-primary/10"><item.icon className="h-5 w-5 text-primary" /></div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{item.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                          </div>
                        </ActivityWrapper>);})}
                  </div>
                ) : ( <EmptyState icon={ListChecks} title="No Recent Activity" message="Your actions will show up here." ctaLink="/search" ctaText="Start Exploring"/>)}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your username, bio, or avatar URL.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProfileUpdate} className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="edit-username">Username</Label>
                        <Input id="edit-username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Your username" disabled={isUpdatingProfile} />
                    </div>
                    <div>
                        <Label htmlFor="edit-bio">Bio</Label>
                        <Textarea id="edit-bio" value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Tell us about yourself..." className="min-h-[80px]" disabled={isUpdatingProfile}/>
                    </div>
                    <div>
                        <Label htmlFor="edit-avatar-url">Avatar URL</Label>
                        <Input id="edit-avatar-url" value={editAvatarUrl} onChange={(e) => setEditAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png" disabled={isUpdatingProfile}/>
                    </div>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isUpdatingProfile}>Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isUpdatingProfile}>
                            {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}
