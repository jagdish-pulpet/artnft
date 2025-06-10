import Link from 'next/link';
import { getAllContentItems } from '@/lib/data';
import { AdminContentTable } from '@/components/admin/AdminContentTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function AdminPage() {
  const contentItems = await getAllContentItems();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin - Manage Content</h1>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Content
          </Link>
        </Button>
      </div>
      <AdminContentTable items={contentItems} />
    </div>
  );
}

export const revalidate = 0; // Ensure fresh data on admin page
