'use client';

import NFTCard from '@/components/nft-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Settings, ListChecks, Image as ImageIcon, Briefcase, DollarSign, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';

const userNfts = [
  { id: 'p1', imageUrl: 'https://placehold.co/600x600.png', title: 'My Masterpiece', artist: 'Current User', price: 'Not for Sale', aiHint: 'personal art' },
  { id: 'p2', imageUrl: 'https://placehold.co/600x600.png', title: 'Digital Sketch', artist: 'Current User', price: '0.3 ETH', aiHint: 'sketch digital' },
  { id: 'p3', imageUrl: 'https://placehold.co/600x600.png', title: 'Pixel Journey', artist: 'Current User', price: '1.2 ETH', aiHint: 'pixel character' },
];

const userActivity = [
    { id: 'a1', type: 'Listed', item: 'My Masterpiece', date: '2024-07-28', details: 'Listed for 1.0 ETH', icon: <Palette className="h-4 w-4 text-blue-500" /> },
    { id: 'a2', type: 'Sold', item: 'Old Artwork', date: '2024-07-25', details: 'Sold for 0.5 ETH to UserX', icon: <DollarSign className="h-4 w-4 text-green-500" /> },
    { id: 'a3', type: 'Purchased', item: 'Abstract Flow', date: '2024-07-22', details: 'Purchased for 0.8 ETH from FluidArtist', icon: <Briefcase className="h-4 w-4 text-purple-500" /> },
];

export default function ProfilePage() {
  const [userName, setUserName] = useState('');
  const [userBio, setUserBio] = useState('');

  useEffect(() => {
    // Simulate fetching user data
    setUserName('Current User');
    setUserBio('Passionate digital artist and collector. Exploring the boundaries of creativity on the blockchain.');
  }, []);
  
  return (
    <div className="space-y-10">
      <Card className="shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-accent shadow-md shrink-0">
            <AvatarImage src="https://placehold.co/200x200.png" alt="User Avatar" data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl font-headline bg-muted">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-grow">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-foreground">{userName}</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">user@example.com</p>
            <p className="text-sm text-muted-foreground max-w-lg mt-2 leading-relaxed">
              {userBio}
            </p>
            <Button variant="outline" size="sm" className="mt-4 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground transition-colors">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-nfts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 bg-muted/70 p-1.5 rounded-lg shadow-inner">
          <TabsTrigger value="my-nfts" className="py-2.5 text-sm font-medium flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md rounded-md transition-all">
            <ImageIcon className="h-5 w-5" /> My NFTs
          </TabsTrigger>
          <TabsTrigger value="activity" className="py-2.5 text-sm font-medium flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md rounded-md transition-all">
            <ListChecks className="h-5 w-5" /> Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="py-2.5 text-sm font-medium flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-md rounded-md transition-all">
            <Settings className="h-5 w-5" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-nfts" className="mt-8">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6 text-foreground">My Collection</h2>
          {userNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {userNfts.map(nft => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center shadow-sm">
              <CardContent>
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-headline text-xl text-muted-foreground">Your collection is empty.</p>
                <p className="text-sm text-muted-foreground mt-1">Create or purchase NFTs to see them here.</p>
                <Button asChild variant="link" className="mt-4 text-accent"><Link href="/create">Create an NFT</Link></Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-8">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6 text-foreground">Recent Activity</h2>
          {userActivity.length > 0 ? (
            <div className="space-y-4">
              {userActivity.map(activity => (
                <Card key={activity.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="p-2 bg-muted/50 rounded-full">
                         {activity.icon || <ListChecks className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-foreground">{activity.type}: <span className="font-normal">{activity.item}</span></p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{activity.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="py-12 text-center shadow-sm">
              <CardContent>
                <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-headline text-xl text-muted-foreground">No recent activity.</p>
                <p className="text-sm text-muted-foreground mt-1">Your transactions and listings will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-8">
           <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-6 text-foreground">Profile Settings</h2>
           <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="font-headline">Edit Your Profile</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={userBio} onChange={(e) => setUserBio(e.target.value)} rows={4} placeholder="Tell us about yourself..." />
                </div>
                 <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
