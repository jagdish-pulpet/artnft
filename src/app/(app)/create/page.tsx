import { ContentForm } from '@/components/content/ContentForm';
import { createContentItem } from '@/lib/actions';

export default function CreateContentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <ContentForm formAction={createContentItem} isEditing={false} />
    </div>
  );
}
