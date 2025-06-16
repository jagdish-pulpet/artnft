import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from 'lucide-react';

type NFTCardProps = {
  id: string;
  imageUrl: string;
  title: string;
  artist: string;
  price: string;
  aiHint?: string;
};

export default function NFTCard({ id, imageUrl, title, artist, price, aiHint }: NFTCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg bg-card group flex flex-col h-full hover:border-accent">
      <CardHeader className="p-0 border-b">
        <Link href={`/marketplace/${id}`} aria-label={`View details for ${title}`} className="block">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={aiHint || "abstract art"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/marketplace/${id}`} className="block">
          <h3 className="font-headline text-xl text-foreground mb-1 truncate group-hover:text-accent transition-colors" title={title}>
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 truncate">By {artist}</p>
        <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-foreground">{price}</p>
            <Button variant="ghost" size="icon" aria-label="Like this NFT" className="text-muted-foreground hover:text-destructive transition-colors">
                <Heart className="w-5 h-5" />
            </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-colors">
          <Link href={`/marketplace/${id}`}>
            View Details <Eye className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
