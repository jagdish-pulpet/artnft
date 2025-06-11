
import Image from 'next/image';
import Link from 'next/link';
import type { NFT } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'; // Removed CardTitle as we'll use a custom h3
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingBag, UserCircle2 } from 'lucide-react'; // Added new icons

interface NftCardProps {
  nft: NFT;
}

export default function NftCard({ nft }: NftCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col h-full group">
      <Link href={`/nfts/${nft.id}`} className="block" aria-label={`View details for ${nft.title}`}>
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full overflow-hidden"> {/* Added overflow-hidden for image scaling */}
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${nft.artStyle.split(' ')[0]} art`}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-3 space-y-1.5 flex-grow"> {/* Reduced padding, added specific space */}
        <Link href={`/nfts/${nft.id}`} className="block">
          <h3 className="text-md font-semibold group-hover:text-accent transition-colors truncate" title={nft.title}>
            {nft.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground">
          <UserCircle2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" /> {/* Placeholder avatar */}
          <span className="truncate" title={nft.artist}>{nft.artist}</span>
        </div>
        <p className="text-xs text-foreground bg-secondary py-0.5 px-1.5 rounded-full inline-block capitalize" title={nft.artStyle}>
          {nft.artStyle}
        </p>
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center border-t mt-auto"> {/* mt-auto to push footer down if content is short */}
        <div className="text-lg font-semibold text-primary">
          {nft.price} ETH
        </div>
        <div className="flex items-center space-x-1"> {/* Reduced space for tighter icons */}
          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-accent/20" aria-label="Like NFT" title="Like">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-accent/20" aria-label="Share NFT" title="Share">
            <Share2 className="w-4 h-4" />
          </Button>
          <Link href={`/nfts/${nft.id}`} passHref>
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-accent/20" aria-label="Bid on or Buy NFT" title="Bid/Buy">
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
