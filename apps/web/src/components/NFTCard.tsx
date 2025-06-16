

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Ensure this uses the local re-export

export interface NFTCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  artistName?: string;
  dataAiHint?: string;
}

export default function NFTCard({ id, imageUrl, title, price, artistName, dataAiHint }: NFTCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    setIsFavorited(prev => {
      const newFavStatus = !prev;
      if (newFavStatus) {
        setTimeout(() => {
          toast({ title: "Favorited! (Simulated)", description: `${title} added to your favorites.` });
        }, 0);
      } else {
        setTimeout(() => {
          toast({ title: "Unfavorited (Simulated)", description: `${title} removed from your favorites.` });
        }, 0);
      }
      return newFavStatus;
    });
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setTimeout(() => {
      toast({ title: "Comment (Simulated)", description: `Opening comments for ${title}.` });
    }, 0);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/nft/${id}`);
    setTimeout(() => {
      toast({ title: "Link Copied! (Simulated)", description: `Link to ${title} copied to clipboard.` });
    }, 0);
  };


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex flex-col">
      <Link href={`/nft/${id}`} className="flex flex-col flex-grow group">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={dataAiHint || "digital art"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {artistName && <p className="text-sm text-muted-foreground truncate">by {artistName}</p>}
          <p className="text-lg font-bold text-primary mt-2">{price}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-t mt-auto">
        <Button variant="default" size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/nft/${id}`}>View Details</Link>
        </Button>
        <div className="flex items-center justify-around w-full sm:w-auto sm:justify-start sm:gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
                "text-muted-foreground hover:text-destructive active:scale-90 transition-transform",
                isFavorited && "text-destructive"
            )} 
            aria-label="Add to favorites"
            onClick={handleFavoriteToggle}
          >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-primary active:scale-90 transition-transform" 
            aria-label="Comment on NFT"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-green-500 active:scale-90 transition-transform" 
            aria-label="Share NFT"
            onClick={handleShareClick}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
