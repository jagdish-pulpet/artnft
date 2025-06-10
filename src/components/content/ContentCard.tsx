import Link from 'next/link';
import type { ContentItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({ item }: ContentCardProps) {
  const snippet = item.text.length > 150 ? item.text.substring(0, 150) + '...' : item.text;
  
  return (
    <Card className="flex flex-col h-full animate-subtle-appear shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
        <CardDescription>
          Published on {new Date(item.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{snippet}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 text-primary hover:text-accent">
          <Link href={`/content/${item.id}`} className="flex items-center gap-1">
            Read More <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
