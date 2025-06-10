
'use server';
/**
 * @fileOverview AI flow for generating NFT descriptions.
 *
 * - generateNftDescription - A function that generates an NFT description.
 * - GenerateNftDescriptionInput - The input type for the generateNftDescription function.
 * - GenerateNftDescriptionOutput - The return type for the generateNftDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateNftDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().describe('The title of the NFT.'),
  keywords: z.string().optional().describe('Optional comma-separated keywords to guide the description.'),
});
export type GenerateNftDescriptionInput = z.infer<typeof GenerateNftDescriptionInputSchema>;

const GenerateNftDescriptionOutputSchema = z.object({
  description: z.string().describe('The AI-generated description for the NFT.'),
});
export type GenerateNftDescriptionOutput = z.infer<typeof GenerateNftDescriptionOutputSchema>;

export async function generateNftDescription(input: GenerateNftDescriptionInput): Promise<GenerateNftDescriptionOutput> {
  return generateNftDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNftDescriptionPrompt',
  input: {schema: GenerateNftDescriptionInputSchema},
  output: {schema: GenerateNftDescriptionOutputSchema},
  prompt: `You are an expert NFT copywriter specializing in creating captivating and descriptive texts for digital art listings.
Given an image of an artwork, its title, and optional keywords, generate a compelling description for the NFT.
The description should be engaging, highlight unique aspects of the artwork, and be suitable for an NFT marketplace.
Aim for a description that is approximately 2-4 sentences long.

Artwork Image: {{media url=photoDataUri}}
Title: {{{title}}}
{{#if keywords}}
Keywords: {{{keywords}}}
{{/if}}

Generate the NFT description.
`,
});

const generateNftDescriptionFlow = ai.defineFlow(
  {
    name: 'generateNftDescriptionFlow',
    inputSchema: GenerateNftDescriptionInputSchema,
    outputSchema: GenerateNftDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

