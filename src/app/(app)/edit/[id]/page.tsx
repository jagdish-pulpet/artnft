import { ContentForm } from '@/components/content/ContentForm';
import { updateContentItem } from '@/lib/actions';
import { getContentItemById } from '@/lib/data';
import { notFound } from 'next/navigation';

interface EditContentPageProps {
  params: { id: string };
}

export default async function EditContentPage({ params }: EditContentPageProps) {
  const item = await getContentItemById(params.id);

  if (!item) {
    notFound();
  }

  // Bind the id to the server action
  const updateActionWithId = updateContentItem.bind(null, item.id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <ContentForm item={item} formAction={updateActionWithId} isEditing={true} />
    </div>
  );
}
