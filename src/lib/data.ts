import type { ContentItem } from '@/types';

// In-memory store for mock data
let contentItems: ContentItem[] = [
  {
    id: '1',
    title: 'The Dawn of Digital Canvases',
    text: 'Exploring the intersection of art and technology, digital canvases offer new frontiers for creators. NFTs are a pivotal part of this evolution, providing verifiable ownership in the digital realm.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: '2',
    title: 'Understanding Smart Contracts in NFTs',
    text: 'Smart contracts are the backbone of NFTs, automating transactions and enforcing rules without intermediaries. This piece delves into how they function and their impact on digital art.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: '3',
    title: 'The Future of Art Curation',
    text: 'With the rise of decentralized platforms, how will art curation change? This article discusses potential shifts from traditional gallery models to community-driven and AI-assisted curation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllContentItems(): Promise<ContentItem[]> {
  await delay(100); // Simulate network latency
  return [...contentItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getContentItemById(id: string): Promise<ContentItem | undefined> {
  await delay(50);
  return contentItems.find(item => item.id === id);
}

export async function addContentItem(itemData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
  await delay(100);
  const newItem: ContentItem = {
    ...itemData,
    id: String(Date.now() + Math.random()), // Simple unique ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  contentItems.unshift(newItem); // Add to the beginning
  return newItem;
}

export async function updateContentItem(id: string, updates: Partial<Omit<ContentItem, 'id' | 'createdAt'>>): Promise<ContentItem | undefined> {
  await delay(100);
  const itemIndex = contentItems.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return undefined;
  }
  contentItems[itemIndex] = {
    ...contentItems[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return contentItems[itemIndex];
}

export async function deleteContentItem(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = contentItems.length;
  contentItems = contentItems.filter(item => item.id !== id);
  return contentItems.length < initialLength;
}
