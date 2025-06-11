'use server';

/**
 * @fileOverview Generates a compelling NFT description using AI.
 *
 * - generateNftDescription - A function that generates the NFT description.
 * - GenerateNftDescriptionInput - The input type for the generateNftDescription function.
 * - GenerateNftDescriptionOutput - The return type for the generateNftDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNftDescriptionInputSchema = z.object({
  nftTitle: z.string().describe('The title of the NFT.'),
  artistName: z.string().describe('The name of the artist.'),
  artStyle: z.string().describe('The art style of the NFT (e.g., Abstract, Pop Art, etc.).'),
  creationDate: z.string().describe('The date the NFT was created.'),
  materialsUsed: z.string().describe('The materials used to create the NFT.'),
  additionalDetails: z.string().describe('Any additional details about the NFT.'),
});

export type GenerateNftDescriptionInput = z.infer<
  typeof GenerateNftDescriptionInputSchema
>;

const GenerateNftDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling description of the NFT.'),
});

export type GenerateNftDescriptionOutput = z.infer<
  typeof GenerateNftDescriptionOutputSchema
>;

export async function generateNftDescription(
  input: GenerateNftDescriptionInput
): Promise<GenerateNftDescriptionOutput> {
  return generateNftDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNftDescriptionPrompt',
  input: {schema: GenerateNftDescriptionInputSchema},
  output: {schema: GenerateNftDescriptionOutputSchema},
  prompt: `You are an expert art curator who is skilled at writing compelling descriptions of NFTs.

  Based on the following information, write a captivating description for the NFT that will attract potential buyers.

  NFT Title: {{{nftTitle}}}
  Artist Name: {{{artistName}}}
  Art Style: {{{artStyle}}}
  Creation Date: {{{creationDate}}}
  Materials Used: {{{materialsUsed}}}
  Additional Details: {{{additionalDetails}}}

  Description:`,
});

const generateNftDescriptionFlow = ai.defineFlow(
  {
    name: 'generateNftDescriptionFlow',
    inputSchema: GenerateNftDescriptionInputSchema,
    outputSchema: GenerateNftDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
