
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NftProps {
  id: string;
  imageUrl: string;
  title: string;
  creator: string;
  price?: string;
  dataAiHint?: string;
  collectionName?: string;
}

export function NftCard({ id, imageUrl, title, creator, price, dataAiHint, collectionName }: NftProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite
    e.preventDefault(); // Also prevent link navigation if the button itself is clicked
    setIsFavorited(!isFavorited);
    // In a real app, you would also make an API call here
    console.log(`NFT ${title} favorite status: ${!isFavorited}`);
  };

  return (
    <Link href={`/nft/${id}`} className="block h-full">
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col h-full group bg-card hover:border-primary/50 border-transparent border">
        <CardHeader className="p-0 relative aspect-square">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={dataAiHint || "nft art"}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-card/80 hover:bg-card text-muted-foreground hover:text-destructive rounded-full z-10 h-8 w-8"
            onClick={toggleFavorite}
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Unfavorite" : "Favorite"}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          {collectionName && (
            <p className="text-xs text-muted-foreground mb-1 truncate">{collectionName}</p>
          )}
          <CardTitle className="text-lg font-semibold tracking-tight text-primary truncate group-hover:text-primary/80 transition-colors">
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            By <span className="font-medium text-foreground">{creator}</span>
          </p>
        </CardContent>
        {price && (
          <CardFooter className="p-4 border-t">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-base font-bold text-accent">{price}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); console.log('Buy clicked'); }} // Prevent card click and link navigation
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy
              </Button>
            </div>
          </CardFooter>
        )}
        {!price && (
           <CardFooter className="p-4 border-t">
             <Button className="w-full" variant="secondary" disabled>Not for sale</Button>
           </CardFooter>
        )}
      </Card>
    </Link>
  );
}
