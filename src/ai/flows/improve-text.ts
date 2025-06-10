'use server';

/**
 * @fileOverview Provides AI-powered suggestions to enhance text clarity and tone.
 *
 * - improveText - A function that takes text as input and returns AI-improved suggestions.
 * - ImproveTextInput - The input type for the improveText function.
 * - ImproveTextOutput - The return type for the improveText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTextInputSchema = z.object({
  text: z.string().describe('The text to be improved.'),
  tone: z.string().optional().describe('The desired tone of the text.'),
});

export type ImproveTextInput = z.infer<typeof ImproveTextInputSchema>;

const ImproveTextOutputSchema = z.object({
  improvedText: z.string().describe('The AI-improved version of the text.'),
});

export type ImproveTextOutput = z.infer<typeof ImproveTextOutputSchema>;

export async function improveText(input: ImproveTextInput): Promise<ImproveTextOutput> {
  return improveTextFlow(input);
}

const improveTextPrompt = ai.definePrompt({
  name: 'improveTextPrompt',
  input: {schema: ImproveTextInputSchema},
  output: {schema: ImproveTextOutputSchema},
  prompt: `You are an AI text improvement assistant.  You will take the
user provided text and improve it, based on the requested tone.

Original Text: {{{text}}}

Tone: {{tone}}

Improved Text:`, 
});

const improveTextFlow = ai.defineFlow(
  {
    name: 'improveTextFlow',
    inputSchema: ImproveTextInputSchema,
    outputSchema: ImproveTextOutputSchema,
  },
  async input => {
    const {output} = await improveTextPrompt(input);
    return output!;
  }
);
