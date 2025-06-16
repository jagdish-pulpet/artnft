
'use client';

import { AppLayout } from '@artnft/ui'; // Updated import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit3, ExternalLink, Image as ImageIcon, Palette, DollarSign, ShoppingBag, History, Heart, UserCheck, Bell, LogOut, HelpCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const mockUserProfile = {
  username: 'CreativeUser123',
  bio: 'Exploring the intersection of art and technology. Collector of unique digital experiences. ETH: 0xAbC...dEf',
  avatarUrl: 'https://placehold.co/128x128.png',
  dataAiHint: 'user avatar',
  bannerUrl: 'https://placehold.co/1200x300.png',
  dataAiBannerHint: 'abstract banner',
  totalNftsOwned: 23,
  totalFavorites: 58,
  totalForSale: 5,
  totalEarningsEth: 12.75,
};

const mockOwnedNfts: NFTCardProps[] = [
  { id: 'owned-nft-1', imageUrl: 'https://placehold.co/300x300.png', title: 'Cosmic Dream #42', price: 'Not for Sale', artistName: 'GalaxyPainter', dataAiHint: 'space nebula' },
  { id: 'owned-nft-2', imageUrl: 'https://placehold.co/300x300.png', title: 'Pixel Pal #007', price: '0.5 ETH (Listed)', artistName: '8BitLegend', dataAiHint: 'pixel character' },
  { id: 'owned-nft-3', imageUrl: 'https://placehold.co/300x300.png', title: 'Synthwave Sunset Loop', price: 'Not for Sale', artistName: 'RetroVibes', dataAiHint: 'retro landscape' },
];

const mockFavoriteNfts: NFTCardProps[] = [
  { id: 'fav-nft-1', imageUrl: 'https://placehold.co/300x300.png', title: 'Abstract Flow #3', price: '1.2 ETH', artistName: 'ModernMuse', dataAiHint: 'abstract colorful' },
  { id: 'fav-nft-2', imageUrl: 'https://placehold.co/300x300.png', title: 'RoboFriend Series X', price: 'On Auction', artistName: 'TechArtisan', dataAiHint: 'robot friend' },
];

type TransactionType = 'purchase' | 'sale' | 'mint' | 'bid_placed' | 'bid_received';
const transactionTypeIcons: Record<TransactionType, React.ElementType> = {
    purchase: ShoppingBag,
    sale: DollarSign,
    mint: Palette,
    bid_placed: DollarSign,
    bid_received: DollarSign,
};
const transactionTypeColors: Record<TransactionType, string> = {
    purchase: 'text-red-500', 
    sale: 'text-green-500', 
    mint: 'text-blue-500', 
    bid_placed: 'text-orange-500', 
    bid_received: 'text-purple-500', 
};


interface Transaction {
  id: string;
  type: TransactionType;
  item: string;
  itemId?: string; 
  amount: string; 
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const mockTransactions: Transaction[] = [
  { id: 'tx1', type: 'sale', item: 'Cosmic Dream #40', itemId: 'nft-abc', amount: '+ 2.1 ETH', date: '2024-07-10', status: 'Completed' },
  { id: 'tx2', type: 'purchase', item: 'Pixel Pal #003', itemId: 'nft-def', amount: '- 0.3 ETH', date: '2024-07-08', status: 'Completed' },
  { id: 'tx3', type: 'mint', item: 'My New Abstract', itemId: 'nft-ghi', amount: '- 0.05 ETH (Gas)', date: '2024-07-05', status: 'Completed' },
  { id: 'tx4', type: 'bid_placed', item: 'RoboFriend Series Y', itemId: 'nft-jkl', amount: 'Bid 0.8 ETH', date: '2024-07-12', status: 'Pending' },
];

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  message: string;
  timestamp: string;
  link?: string;
}

const mockRecentActivity: ActivityItem[] = [
  { id: 'act1', icon: Heart, message: 'You favorited "Cyber Orb".', timestamp: '2 hours ago', link: '/nft/cyber-orb-id' },
  { id: 'act2', icon: UserCheck, message: 'You started following @ArtIsLife.', timestamp: '1 day ago', link: '/profile/artist-id' },
  { id: 'act3', icon: DollarSign, message: 'Your bid of 0.5 ETH on "Future Scape" was outbid.', timestamp: '2 days ago', link: '/nft/future-scape-id' },
  { id: 'act4', icon: Palette, message: 'You minted "My City Dreams".', timestamp: '3 days ago', link: '/nft/my-city-dreams-id' },
];

interface AdminAnnouncement {
    id: string;
    title: string;
    content: string;
    date: string;
    icon: React.ElementType;
}

const mockAdminAnnouncements: AdminAnnouncement[] = [
    { id: 'ann1', title: 'New Feature: Collections!', content: 'Organize your NFTs into curated collections. Available now in your profile!', date: '2024-07-15', icon: Palette},
    { id: 'ann2', title: 'Platform Maintenance Schedule', content: 'Brief maintenance scheduled for July 20th, 2 AM UTC.', date: '2024-07-12', icon: Settings},
];


export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('artnft_user_token');
        localStorage.removeItem('artnft_user_details');
        localStorage.removeItem('adminToken'); 
        localStorage.removeItem('isAdminAuthenticated'); 
    }
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/welcome');
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-0 md:p-4 space-y-6 md:space-y-8">
        <Card className="overflow-hidden shadow-lg border-border relative">
          <div className="h-40 md:h-56 bg-muted relative">
            {mockUserProfile.bannerUrl && (
              <Image
                src={mockUserProfile.bannerUrl}
                alt={`${mockUserProfile.username}'s banner`}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={mockUserProfile.dataAiBannerHint}
              />
            )}
          </div>
          <div className="relative p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
                <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.username} data-ai-hint={mockUserProfile.dataAiHint}/>
                <AvatarFallback>{mockUserProfile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">{mockUserProfile.username}</h1>
                <p className="text-sm text-muted-foreground line-clamp-2">{mockUserProfile.bio}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                        <Settings className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Settings</span>
                    </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Edit Profile</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
                  <LogOut className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Log Out</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'NFTs Owned', value: mockUserProfile.totalNftsOwned, icon: ImageIcon },
            { label: 'Favorites', value: mockUserProfile.totalFavorites, icon: Heart },
            { label: 'Items for Sale', value: mockUserProfile.totalForSale, icon: DollarSign },
            { label: 'Total Earnings', value: `${mockUserProfile.totalEarningsEth} ETH`, icon: DollarSign }
          ].map(stat => (
            <Card key={stat.label} className="text-center shadow-sm p-3 md:p-4 hover:border-primary transition-colors">
              <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mb-1 md:mb-1.5" />
              <p className="text-sm md:text-base font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {mockAdminAnnouncements.length > 0 && (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg"><Bell className="mr-2 h-5 w-5 text-primary"/> Platform Updates</CardTitle>
                    <CardDescription>Latest news and announcements from ArtNFT.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {mockAdminAnnouncements.map(ann => {
                        const AnnouncementIcon = ann.icon;
                        return (
                            <div key={ann.id} className="p-3 border rounded-lg bg-muted/30 flex items-start space-x-3">
                                <AnnouncementIcon className="h-5 w-5 text-primary mt-0.5 shrink-0"/>
                                <div>
                                    <h4 className="font-medium text-sm text-foreground">{ann.title}</h4>
                                    <p className="text-xs text-muted-foreground">{ann.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{ann.date}</p>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        )}

        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto mb-4">
            <TabsTrigger value="owned" className="py-2.5">Owned NFTs</TabsTrigger>
            <TabsTrigger value="favorites" className="py-2.5">Favorites</TabsTrigger>
            <TabsTrigger value="transactions" className="py-2.5">Transaction History</TabsTrigger>
            <TabsTrigger value="activity" className="py-2.5">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="owned">
            <Card className="shadow-md">
              <CardHeader><CardTitle>My Owned NFTs</CardTitle></CardHeader>
              <CardContent>
                {mockOwnedNfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {mockOwnedNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
                  </div>
                ) : <p className="text-muted-foreground text-center py-8">You don't own any NFTs yet. <Link href="/search" className="text-primary hover:underline">Explore the marketplace!</Link></p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="shadow-md">
              <CardHeader><CardTitle>My Favorite NFTs</CardTitle></CardHeader>
              <CardContent>
                {mockFavoriteNfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {mockFavoriteNfts.map(nft => <NFTCard key={nft.id} {...nft} />)}
                  </div>
                ) : <p className="text-muted-foreground text-center py-8">You haven't favorited any NFTs. <Link href="/search" className="text-primary hover:underline">Start exploring!</Link></p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="shadow-md">
              <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
              <CardContent>
                {mockTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {mockTransactions.map(tx => {
                      const TxIcon = transactionTypeIcons[tx.type];
                      const amountColor = transactionTypeColors[tx.type];
                      return (
                        <div key={tx.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                            <TxIcon className={`h-5 w-5 ${amountColor} shrink-0`} />
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {tx.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {tx.item}
                                {tx.itemId && <Link href={`/nft/${tx.itemId}`}><ExternalLink className="inline-block h-3 w-3 ml-1 text-primary/70 hover:text-primary"/></Link>}
                              </p>
                              <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right w-full sm:w-auto">
                            <p className={`text-sm font-semibold ${amountColor}`}>{tx.amount}</p>
                            <p className={`text-xs ${tx.status === 'Completed' ? 'text-green-600' : tx.status === 'Pending' ? 'text-orange-500' : 'text-red-600'}`}>{tx.status}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="text-muted-foreground text-center py-8">No transactions yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="shadow-md">
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>
                {mockRecentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {mockRecentActivity.map(act => {
                        const ActivityIcon = act.icon;
                        const ActivityWrapper = act.link ? Link : 'div';
                        return (
                            <ActivityWrapper
                                key={act.id}
                                {...(act.link ? {href: act.link} : {})}
                                className={`flex items-center space-x-3 p-3 border rounded-lg ${act.link ? 'hover:bg-muted/20 transition-colors cursor-pointer' : ''}`}
                            >
                                <ActivityIcon className="h-5 w-5 text-primary shrink-0" />
                                <div className="flex-grow">
                                    <p className="text-sm text-foreground">{act.message}</p>
                                    <p className="text-xs text-muted-foreground">{act.timestamp}</p>
                                </div>
                                {act.link && <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary"/>}
                            </ActivityWrapper>
                        );
                    })}
                  </div>
                ) : <p className="text-muted-foreground text-center py-8">No recent activity to display.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </AppLayout>
  );
}

