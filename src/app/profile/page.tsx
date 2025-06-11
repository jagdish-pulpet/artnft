
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import { User, Settings, Palette, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const userOwnedNfts = mockNfts.slice(0, 3); // Mock: User owns first 3 NFTs
  const favoriteArtists = ['Stellar Scribe', 'TechFlora', 'BitMapper']; // Mock favorite artists

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-secondary rounded-t-lg p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-card">
              <Image
                src="https://placehold.co/200x200.png"
                alt="User Avatar"
                layout="fill"
                objectFit="cover"
                data-ai-hint="avatar person"
              />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-headline mb-1">CreativeCollector23</CardTitle>
              <CardDescription className="text-muted-foreground">Joined March 2023 • Collector & Art Enthusiast</CardDescription>
              <div className="mt-3">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-foreground/80 leading-relaxed">
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
