
'use server';
/**
 * @fileOverview AI flow for suggesting NFT titles.
 *
 * - suggestNftTitles - A function that suggests NFT titles.
 * - SuggestNftTitlesInput - The input type for the suggestNftTitles function.
 * - SuggestNftTitlesOutput - The return type for the suggestNftTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestNftTitlesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  concept: z.string().optional().describe('An optional brief concept or description of the artwork to guide title generation.'),
});
export type SuggestNftTitlesInput = z.infer<typeof SuggestNftTitlesInputSchema>;

const SuggestNftTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe('An array of 3-5 suggested titles for the NFT.'),
});
export type SuggestNftTitlesOutput = z.infer<typeof SuggestNftTitlesOutputSchema>;

export async function suggestNftTitles(input: SuggestNftTitlesInput): Promise<SuggestNftTitlesOutput> {
  return suggestNftTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNftTitlesPrompt',
  input: {schema: SuggestNftTitlesInputSchema},
  output: {schema: SuggestNftTitlesOutputSchema},
  prompt: `You are a Creative Naming Specialist for digital art and NFTs.
Given an image of an artwork and an optional concept, suggest 3 to 5 catchy, relevant, and unique titles for this NFT.
Consider the mood, style, and potential subject matter of the artwork.

Artwork Image: {{media url=photoDataUri}}
{{#if concept}}
Artwork Concept: {{{concept}}}
{{/if}}

Provide a list of 3 to 5 distinct title suggestions.
`,
});

const suggestNftTitlesFlow = ai.defineFlow(
  {
    name: 'suggestNftTitlesFlow',
    inputSchema: SuggestNftTitlesInputSchema,
    outputSchema: SuggestNftTitlesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

