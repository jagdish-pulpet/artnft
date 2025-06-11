
import Image from 'next/image';
import Link from 'next/link';
import type { NFT } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface NftCardProps {
  nft: NFT;
}

export default function NftCard({ nft }: NftCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col h-full">
      <Link href={`/nfts/${nft.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${nft.artStyle.split(' ')[0]} art`}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/nfts/${nft.id}`} className="block">
          <CardTitle className="text-lg font-headline mb-1 hover:text-accent transition-colors">{nft.title}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">By {nft.artist}</p>
        <p className="text-xs text-foreground bg-secondary py-1 px-2 rounded-full inline-block">{nft.artStyle}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="text-lg font-semibold text-primary-foreground">
          {nft.price} ETH
        </div>
        <Link href={`/nfts/${nft.id}`} passHref legacyBehavior>
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
