
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import { User, Settings, Palette, Edit3, Users, Eye, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import type { NFT } from '@/types';

interface MockUser {
  username: string;
  bio: string;
  joinDate: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  followersCount: number;
  followingCount: number;
  ownedNfts: NFT[];
  favoriteArtists: string[];
}

const mockUser: MockUser = {
  username: 'ArtExplorer92',
  bio: 'Digital art aficionado. Curator of dreams. Always seeking the next masterpiece. 🎨✨ Exploring the vibrant world of NFTs and connecting with fellow creators and collectors.',
  joinDate: '2023-07-15',
  avatarUrl: 'https://placehold.co/200x200.png',
  coverPhotoUrl: 'https://placehold.co/1200x400.png',
  followersCount: 2458,
  followingCount: 587,
  ownedNfts: mockNfts.slice(0, 3), 
  favoriteArtists: ['Stellar Scribe', 'TechFlora', 'BitMapper', 'AquaDreamer', 'LumiPainter'],
};

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

export default function ProfilePage() {
  const userOwnedNfts = mockUser.ownedNfts;
  const joinedDateFormatted = new Date(mockUser.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-40 sm:h-56 md:h-64 w-full bg-muted">
          <Image
            src={mockUser.coverPhotoUrl}
            alt={`${mockUser.username}'s Cover Photo`}
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            data-ai-hint="abstract background"
          />
        </div>
        <div className="relative p-4 sm:p-6 -mt-16 sm:-mt-20 md:-mt-24">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-card shadow-md shrink-0 bg-muted">
              <Image
                src={mockUser.avatarUrl}
                alt={`${mockUser.username}'s Avatar`}
                fill
                sizes="(max-width: 639px) 7rem, (max-width: 767px) 8rem, 9rem"
                className="object-cover"
                data-ai-hint="avatar person"
              />
            </div>
            <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
              <CardTitle className="text-2xl sm:text-3xl font-headline mb-1">{mockUser.username}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <CalendarDays className="w-4 h-4 text-accent"/> 
                    <span>Joined {joinedDateFormatted}</span>
                </div>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Users className="w-4 h-4 text-accent"/> 
                  <span>{formatCount(mockUser.followersCount)} <span className="hidden sm:inline">Followers</span></span>
                </div>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Eye className="w-4 h-4 text-accent"/> 
                  <span>{formatCount(mockUser.followingCount)} <span className="hidden sm:inline">Following</span></span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 shrink-0 w-full sm:w-auto">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground w-full sm:w-auto">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6 pt-2">
           <CardDescription className="text-foreground/80 leading-relaxed mt-4 border-t border-border pt-4 text-sm sm:text-base">
            {mockUser.bio}
          </CardDescription>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold mb-4 px-1 sm:px-0">My Collection</h2>
        {userOwnedNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userOwnedNfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground px-1 sm:px-0">You don&apos;t own any NFTs yet. <Link href="/search" className="text-accent hover:underline">Start exploring!</Link></p>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-accent" /> Favorite Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockUser.favoriteArtists.length > 0 ? (
              <ul className="space-y-2">
                {mockUser.favoriteArtists.map((artist) => (
                  <li key={artist} className="text-foreground/90 hover:text-accent transition-colors text-sm sm:text-base">
                    <Link href={`/artist/${artist.replace(/\s+/g, '-').toLowerCase()}`}>{artist}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm sm:text-base">No favorite artists added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-accent" /> Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Manage Wallet</Link></li>
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Notification Preferences</Link></li>
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Security Settings</Link></li>
            </ul>
            <Button variant="destructive" className="mt-4 w-full text-sm">Log Out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
