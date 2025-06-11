
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import { User, Settings, Palette, Edit3, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const userOwnedNfts = mockNfts.slice(0, 3); 
  const favoriteArtists = ['Stellar Scribe', 'TechFlora', 'BitMapper']; 

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="relative h-40 sm:h-56 md:h-64 w-full bg-muted">
          <Image
            src="https://placehold.co/1200x400.png" 
            alt="User Cover Photo"
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            data-ai-hint="abstract background"
          />
        </div>
        <div className="relative p-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-card shadow-md shrink-0">
              <Image
                src="https://placehold.co/200x200.png"
                alt="User Avatar"
                fill
                sizes="(max-width: 639px) 8rem, 9rem"
                className="object-cover"
                data-ai-hint="avatar person"
              />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <CardTitle className="text-2xl sm:text-3xl font-headline mb-1">CreativeCollector23</CardTitle>
              <CardDescription className="text-muted-foreground">Joined March 2023 • Collector & Art Enthusiast</CardDescription>
              <div className="mt-2 flex gap-4 justify-center sm:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-accent"/> 
                  <span>1.2k <span className="hidden sm:inline">Followers</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-accent"/> 
                  <span>340 <span className="hidden sm:inline">Following</span></span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 shrink-0">
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-6 pt-2">
          <p className="text-foreground/80 leading-relaxed mt-4 border-t border-border pt-4">
            Passionate about digital art that pushes boundaries. Always on the lookout for unique pieces and emerging talents.
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold mb-4">My Collection</h2>
        {userOwnedNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userOwnedNfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You don&apos;t own any NFTs yet. <Link href="/search" className="text-accent hover:underline">Start exploring!</Link></p>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Palette className="w-6 h-6 text-accent" /> Favorite Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteArtists.length > 0 ? (
              <ul className="space-y-2">
                {favoriteArtists.map((artist) => (
                  <li key={artist} className="text-foreground/90 hover:text-accent transition-colors">
                    <Link href={`/artist/${artist.replace(/\s+/g, '-').toLowerCase()}`}>{artist}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No favorite artists added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Settings className="w-6 h-6 text-accent" /> Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Manage Wallet</Link></li>
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Notification Preferences</Link></li>
              <li><Link href="#" className="text-foreground/90 hover:text-accent transition-colors">Security Settings</Link></li>
            </ul>
            <Button variant="destructive" className="mt-4 w-full">Log Out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
