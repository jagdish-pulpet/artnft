// src/ai/flows/personalized-nft-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized NFT recommendations based on user preferences.
 *
 * - getNftRecommendations - A function that returns a list of recommended NFTs.
 * - NftRecommendationsInput - The input type for the getNftRecommendations function.
 * - NftRecommendationsOutput - The return type for the getNftRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NftRecommendationsInputSchema = z.object({
  userViewingHistory: z
    .array(z.string())
    .describe('An array of NFT IDs representing the user viewing history.'),
  userSavedNfts: z
    .array(z.string())
    .describe('An array of NFT IDs representing the user saved NFTs.'),
});
export type NftRecommendationsInput = z.infer<typeof NftRecommendationsInputSchema>;

const NftRecommendationsOutputSchema = z.array(z.object({
  nftId: z.string().describe('The ID of the recommended NFT.'),
  title: z.string().describe('The title of the recommended NFT.'),
  imageUrl: z.string().describe('The URL of the NFT image.'),
  artist: z.string().describe('The artist of the recommended NFT.'),
  price: z.number().describe('The price of the recommended NFT.'),
}));

export type NftRecommendationsOutput = z.infer<typeof NftRecommendationsOutputSchema>;

export async function getNftRecommendations(input: NftRecommendationsInput): Promise<NftRecommendationsOutput> {
  return nftRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nftRecommendationsPrompt',
  input: {schema: NftRecommendationsInputSchema},
  output: {schema: NftRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing personalized NFT recommendations.

  Based on the user's viewing history and saved NFTs, you will suggest a list of NFTs that the user might be interested in.

  User Viewing History: {{userViewingHistory}}
  User Saved NFTs: {{userSavedNfts}}

  Please provide the recommendations in the following JSON format:
  [{{nftId: string, title: string, imageUrl: string, artist: string, price: number}}]
  `,
});

const nftRecommendationsFlow = ai.defineFlow(
  {
    name: 'nftRecommendationsFlow',
    inputSchema: NftRecommendationsInputSchema,
    outputSchema: NftRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
