'use server';
/**
 * @fileOverview Generates cover image suggestions based on a project description.
 *
 * - suggestCoverImages - A function that suggests cover images based on the project description.
 * - SuggestCoverImagesInput - The input type for the suggestCoverImages function.
 * - SuggestCoverImagesOutput - The return type for the suggestCoverImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCoverImagesInputSchema = z.object({
  description: z.string().describe('The description of the creative project.'),
});
export type SuggestCoverImagesInput = z.infer<typeof SuggestCoverImagesInputSchema>;

const SuggestCoverImagesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of suggested image URLs for the cover image.'),
});
export type SuggestCoverImagesOutput = z.infer<typeof SuggestCoverImagesOutputSchema>;

export async function suggestCoverImages(input: SuggestCoverImagesInput): Promise<SuggestCoverImagesOutput> {
  return suggestCoverImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCoverImagesPrompt',
  input: {schema: SuggestCoverImagesInputSchema},
  output: {schema: SuggestCoverImagesOutputSchema},
  prompt: `You are a creative assistant helping users find cover images for their projects.
  Based on the project description provided, suggest 3 relevant image URLs that could be used as a cover image.
  Project Description: {{{description}}}
  `,
});

const suggestCoverImagesFlow = ai.defineFlow(
  {
    name: 'suggestCoverImagesFlow',
    inputSchema: SuggestCoverImagesInputSchema,
    outputSchema: SuggestCoverImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
