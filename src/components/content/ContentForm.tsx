'use client';

import type { ContentItem } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import { Loader2 } from 'lucide-react';
import React from 'react';

const contentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  text: z.string().min(10, 'Text must be at least 10 characters long.'),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  item?: ContentItem;
  formAction: (formData: FormData) => Promise<void>; // Server action
  isEditing: boolean;
}

export function ContentForm({ item, formAction, isEditing }: ContentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: item?.title || '',
      text: item?.text || '',
    },
  });

  async function onSubmit(data: ContentFormData) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('text', data.text);

    try {
      await formAction(formData);
      toast({
        title: isEditing ? "Content Updated" : "Content Created",
        description: `Your content "${data.title}" has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      // Redirect is handled by server action
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: (error as Error).message || `Failed to ${isEditing ? 'update' : 'create'} content.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
    // No need to setIsSubmitting(false) if redirect happens, but good for error cases.
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg animate-subtle-appear">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{isEditing ? 'Edit Content' : 'Create New Content'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your content here..." {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Content'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
