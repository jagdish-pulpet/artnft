
import Image from 'next/image';
import { getMockNftById, getMockNftsByCollectionId, mockNfts } from '@/lib/mock-data';
import type { NFT, NFTOwner } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, Users, CalendarDays, Palette, ShoppingCart, History, Layers } from 'lucide-react';
import Link from 'next/link';
import NftCard from '@/components/nft-card';

interface NftDetailsPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return mockNfts.map((nft) => ({
    id: nft.id,
  }));
}

export default async function NftDetailsPage({ params }: NftDetailsPageProps) {
  const nft: NFT | undefined = getMockNftById(params.id);

  if (!nft) {
    return <div className="text-center py-12">NFT not found.</div>;
  }

  const relatedNfts = nft.relatedCollectionIds?.flatMap(collectionId => getMockNftsByCollectionId(collectionId))
    .filter(relatedNft => relatedNft && relatedNft.id !== nft.id) // Ensure relatedNft is defined and not the current NFT
    .slice(0, 3) || []; // Limit to 3 related NFTs

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto min-h-[300px] md:min-h-full">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              layout="fill"
              objectFit="contain"
              className="bg-muted p-4"
              data-ai-hint={`${nft.artStyle.split(' ')[0]} art`}
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold mb-2 text-primary-foreground">{nft.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              By <Link href={`/artist/${nft.artist}`} className="text-accent hover:underline">{nft.artist}</Link>
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                <span>{nft.artStyle}</span>
              </div>
              {nft.creationDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  <span>Created: {new Date(nft.creationDate).toLocaleDateString()}</span>
                </div>
              )}
              {nft.materialsUsed && (
                 <div className="flex items-center gap-2 col-span-2">
                  <Layers className="w-5 h-5 text-accent" />
                  <span>Materials: {nft.materialsUsed}</span>
                </div>
              )}
            </div>

            <CardDescription className="text-base mb-6 text-foreground/80 leading-relaxed">{nft.description}</CardDescription>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary-foreground">{nft.price} ETH</p>
                {/* Add USD conversion if available */}
              </div>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
              </Button>
              {/* Or Add to Cart / Make Offer buttons */}
            </div>
          </div>
        </div>
      </Card>

      {nft.ownershipHistory && nft.ownershipHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <History className="w-6 h-6 text-accent" /> Ownership History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {nft.ownershipHistory.map((entry: NFTOwner, index: number) => (
                <li key={index} className="flex justify-between items-center p-3 bg-secondary rounded-md text-sm">
                  <div>
                    <p className="font-semibold">{entry.owner}</p>
                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                  {entry.price && <p className="text-sm font-medium">{entry.price} ETH</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {relatedNfts.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-headline font-semibold mb-4">Related Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedNfts.map((relatedNft) => (
              relatedNft ? <NftCard key={relatedNft.id} nft={relatedNft} /> : null
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
