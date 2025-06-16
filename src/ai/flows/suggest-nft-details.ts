// src/ai/flows/suggest-nft-details.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests NFT details (title, description, tags)
 * based on the artwork content (image and potentially other metadata).
 *
 * - suggestNftDetails - The main function to trigger the NFT details suggestion flow.
 * - SuggestNftDetailsInput - The input type for the suggestNftDetails function, including the artwork image data URI and any existing description.
 * - SuggestNftDetailsOutput - The output type for the suggestNftDetails function, providing suggested title, description, and tags for the NFT.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNftDetailsInputSchema = z.object({
  artworkDataUri: z
    .string()
    .describe(
      "The artwork image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  existingDescription: z.string().optional().describe('Any existing description provided by the user.'),
});
export type SuggestNftDetailsInput = z.infer<typeof SuggestNftDetailsInputSchema>;

const SuggestNftDetailsOutputSchema = z.object({
  title: z.string().describe('A suggested title for the NFT artwork.'),
  description: z.string().describe('A suggested description for the NFT artwork.'),
  tags: z.array(z.string()).describe('Suggested tags for the NFT artwork.'),
});
export type SuggestNftDetailsOutput = z.infer<typeof SuggestNftDetailsOutputSchema>;

export async function suggestNftDetails(input: SuggestNftDetailsInput): Promise<SuggestNftDetailsOutput> {
  return suggestNftDetailsFlow(input);
}

const suggestNftDetailsPrompt = ai.definePrompt({
  name: 'suggestNftDetailsPrompt',
  input: {schema: SuggestNftDetailsInputSchema},
  output: {schema: SuggestNftDetailsOutputSchema},
  prompt: `You are an AI assistant helping users create NFTs by suggesting relevant details for their artwork.

  Given the artwork (image) and any existing description, suggest a suitable title, a comprehensive description, and relevant tags.
  The title should be concise and engaging. The description should capture the essence, style, and unique aspects of the artwork.
  The tags should be keywords that help users discover the NFT.

  Consider the following information when generating the suggestions:
  Existing Description (if any): {{{existingDescription}}}
  Artwork: {{media url=artworkDataUri}}

  Ensure that the title, description and tags are appropriate to the artwork.
  The tags must be suitable as search keywords.
  Respond in a structured JSON format.
  `,
});

const suggestNftDetailsFlow = ai.defineFlow(
  {
    name: 'suggestNftDetailsFlow',
    inputSchema: SuggestNftDetailsInputSchema,
    outputSchema: SuggestNftDetailsOutputSchema,
  },
  async input => {
    const {output} = await suggestNftDetailsPrompt(input);
    return output!;
  }
);
