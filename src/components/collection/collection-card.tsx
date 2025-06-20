
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Palette, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Collection } from '@/types/entities';

// The props are now based on the Collection entity from backend
// which includes a nested creator object.
export interface CollectionCardProps extends Collection {}

export function CollectionCard({
  id,
  slug,
  name,
  description,
  logoImageUrl,
  coverImageUrl, // Using this as the main image for the card
  creator,
  itemCount,
  volumeTraded,
  floorPrice,
  dataAiHint,
}: CollectionCardProps) {
  const displayImageUrl = coverImageUrl || logoImageUrl || 'https://placehold.co/600x400.png';
  const creatorName = creator?.username || 'Unknown Creator';
  const creatorAvatar = creator?.avatarUrl;
  const creatorProfileLink = creator?.id ? `/profile/${creator.id}` : '#';


  return (
    <Link href={`/collections/${slug || id}`} className="block h-full">
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col h-full group bg-card hover:border-primary/50 border-transparent border">
        <CardHeader className="p-0 relative aspect-[16/9] sm:aspect-video">
          <Image
            src={displayImageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={dataAiHint || "collection art abstract"}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={logoImageUrl || `https://placehold.co/40x40.png?text=${name.charAt(0)}`} alt={`${name} logo`} data-ai-hint="collection logo symbol"/>
              <AvatarFallback>{name.substring(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight text-primary truncate group-hover:text-primary/80 transition-colors">
                {name}
              </CardTitle>
               <p className="text-xs text-muted-foreground mt-0.5">
                By <span className="font-medium text-foreground hover:underline">{creatorName}</span>
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-[2.5em]">
            {description || "No description available."}
          </p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{itemCount.toLocaleString()} items</span>
            {floorPrice && <span>Floor: {floorPrice} ETH</span>}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link href={`/collections/${slug || id}`}>
              <Eye className="mr-2 h-4 w-4" /> View Collection
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
