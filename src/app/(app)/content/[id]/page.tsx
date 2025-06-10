import Link from 'next/link';
import { getContentItemById } from '@/lib/data';
import { ContentDisplay } from '@/components/content/ContentDisplay';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { Edit3, ArrowLeft } from 'lucide-react';

interface ContentPageProps {
  params: { id: string };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const item = await getContentItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/edit/${item.id}`} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Content
          </Link>
        </Button>
      </div>
      <ContentDisplay item={item} />
    </div>
  );
}

export async function generateStaticParams() {
  // In a real app, fetch all content IDs here
  // For mock, this is not strictly necessary unless many items
  return [];
}

export const revalidate = 60; // Revalidate page content
