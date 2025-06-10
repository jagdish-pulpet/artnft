import type { ContentItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentDisplayProps {
  item: ContentItem;
}

export function ContentDisplay({ item }: ContentDisplayProps) {
  return (
    <Card className="shadow-lg animate-subtle-appear">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">{item.title}</CardTitle>
        <CardDescription>
          Published on: {new Date(item.createdAt).toLocaleDateString()} | Last updated: {new Date(item.updatedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert text-foreground">
          {item.text.split('\\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
