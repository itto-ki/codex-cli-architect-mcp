import { z } from 'zod';
import { DEFAULT_MODEL } from '../constants.js';
import type { ToolDefinition } from '../types/index.js';
import { executeCodexCommand } from '../utils/codexExecutor.js';

export const reviewSchema = z.object({
  target: z
    .string()
    .min(1)
    .describe('Review target specification (e.g., file paths, "modified files", "staged changes")'),
  focus: z
    .array(z.enum(['security', 'performance', 'readability', 'best-practices']))
    .optional()
    .describe('Specific areas to focus on'),
  language: z.string().optional().describe('Programming language'),
  model: z.string().optional().describe('AI model to use'),
});

export const codexReviewTool: ToolDefinition<z.infer<typeof reviewSchema>> = {
  name: 'codex_review',
  description:
    'Perform comprehensive code review. The MCP client should determine appropriate files based on the target specification - provide file paths, modified files, or relevant context',
  schema: reviewSchema,

  async execute(args) {
    const {
      target,
      focus = ['security', 'performance', 'readability', 'best-practices'],
      language,
      model = DEFAULT_MODEL,
    } = args;

    let prompt = `Perform a code review focusing on ${focus.join(', ')}.\n`;

    if (language) {
      prompt += `Language: ${language}\n`;
    }

    prompt += `\nReview target: ${target}\n`;
    prompt += `\nProvide detailed feedback with severity levels (high/medium/low).`;

    const result = await executeCodexCommand(prompt, { model });

    if (!result.success) {
      throw new Error(result.error || 'Failed to perform code review');
    }

    return result.output || 'No review feedback generated';
  },
};
