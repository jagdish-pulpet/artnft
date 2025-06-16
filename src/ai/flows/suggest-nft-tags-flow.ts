
'use server';
/**
 * @fileOverview AI flow for suggesting NFT tags/keywords.
 *
 * - suggestNftTags - A function that suggests NFT tags.
 * - SuggestNftTagsInput - The input type for the suggestNftTags function.
 * - SuggestNftTagsOutput - The return type for the suggestNftTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestNftTagsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().describe('The title of the NFT.'),
  description: z.string().describe('The description of the NFT.'),
});
export type SuggestNftTagsInput = z.infer<typeof SuggestNftTagsInputSchema>;

const SuggestNftTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of 5-10 suggested tags/keywords for the NFT.'),
});
export type SuggestNftTagsOutput = z.infer<typeof SuggestNftTagsOutputSchema>;

export async function suggestNftTags(input: SuggestNftTagsInput): Promise<SuggestNftTagsOutput> {
  return suggestNftTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNftTagsPrompt',
  input: {schema: SuggestNftTagsInputSchema},
  output: {schema: SuggestNftTagsOutputSchema},
  prompt: `You are an NFT metadata expert specializing in tag and keyword optimization for discoverability.
Analyze the provided artwork image, its title, and its description.
Suggest 5 to 10 relevant and effective tags or keywords that would help users find this NFT on a marketplace.
Consider art style, subject matter, mood, colors, and potential use cases.

Artwork Image: {{media url=photoDataUri}}
Title: {{{title}}}
Description: {{{description}}}

Provide a list of 5 to 10 tags.
`,
});

const suggestNftTagsFlow = ai.defineFlow(
  {
    name: 'suggestNftTagsFlow',
    inputSchema: SuggestNftTagsInputSchema,
    outputSchema: SuggestNftTagsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

