'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  addContentItem as dbAddContentItem,
  updateContentItem as dbUpdateContentItem,
  deleteContentItem as dbDeleteContentItem,
  getContentItemById as dbGetContentItemById,
} from './data';
import type { NewContentItem, ContentItem } from '@/types';
import { improveText as aiImproveText, type ImproveTextInput } from '@/ai/flows/improve-text';

const contentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  text: z.string().min(10, 'Text must be at least 10 characters long.'),
});

export async function createContentItem(formData: FormData) {
  const validatedFields = contentSchema.safeParse({
    title: formData.get('title'),
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    // This is a basic error handling. In a real app, you'd return detailed errors.
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid data provided.');
  }

  const newContent: NewContentItem = validatedFields.data;
  try {
    await dbAddContentItem(newContent);
  } catch (error) {
    console.error('Failed to create content item:', error);
    throw new Error('Failed to create content item.');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/');
}

export async function updateContentItem(id: string, formData: FormData) {
  const item = await dbGetContentItemById(id);
  if (!item) {
    throw new Error('Content item not found.');
  }

  const validatedFields = contentSchema.safeParse({
    title: formData.get('title'),
    text: formData.get('text'),
  });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    throw new Error('Invalid data provided for update.');
  }

  const updates: Partial<Omit<ContentItem, 'id' | 'createdAt'>> = validatedFields.data;
  try {
    await dbUpdateContentItem(id, updates);
  } catch (error) {
    console.error('Failed to update content item:', error);
    throw new Error('Failed to update content item.');
  }

  revalidatePath('/');
  revalidatePath(`/content/${id}`);
  revalidatePath('/admin');
  redirect(`/content/${id}`);
}

export async function deleteContentItemAction(id: string) {
  try {
    const success = await dbDeleteContentItem(id);
    if (!success) {
      throw new Error('Failed to find item to delete.');
    }
  } catch (error) {
    console.error('Failed to delete content item:', error);
    throw new Error('Failed to delete content item.');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  // No redirect needed if deleting from admin page, let it re-render the list.
  // If deleting from a content page, might redirect to home or admin.
}


const improveTextSchema = z.object({
  text: z.string().min(1, "Text cannot be empty."),
  tone: z.string().optional(),
});

export async function improveTextAction(prevState: any, formData: FormData) {
  const validatedFields = improveTextSchema.safeParse({
    text: formData.get('text'),
    tone: formData.get('tone') || undefined, // Handle empty string as undefined
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      improvedText: null,
    };
  }
  
  const input: ImproveTextInput = validatedFields.data;

  try {
    const result = await aiImproveText(input);
    return {
      message: "Text improved successfully.",
      errors: null,
      improvedText: result.improvedText,
    };
  } catch (error) {
    console.error("AI text improvement failed:", error);
    return {
      message: "An error occurred while improving text.",
      errors: null,
      improvedText: null,
    };
  }
}
