export interface ContentItem {
  id: string;
  title: string;
  text: string;
  createdAt: string; // Store as ISO string for simplicity with mock data
  updatedAt: string; // Store as ISO string
}

export type NewContentItem = Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>;
