import Link from 'next/link';
import { getAllContentItems } from '@/lib/data';
import { ContentCard } from '@/components/content/ContentCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function HomePage() {
  const contentItems = await getAllContentItems();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Latest Content</h1>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New
          </Link>
        </Button>
      </div>
      
      {contentItems.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No content available yet. Start by creating some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
