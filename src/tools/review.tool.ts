import { z } from 'zod';
import { DEFAULT_MODEL } from '../constants.js';
import type { ToolDefinition } from '../types/index.js';
import { executeCodexCommand } from '../utils/codexExecutor.js';

export const reviewSchema = z.object({
  target: z
    .string()
    .min(1)
    .describe('What to review - feature/component (e.g., "user authentication"), or Git context (e.g., "git diff", "staged changes", "changes in feature-branch"). Codex will identify relevant files automatically'),
  focus: z
    .array(z.enum(['security', 'performance', 'readability', 'best-practices', 'architecture']))
    .optional()
    .describe('Specific areas to focus on'),
  languages: z.array(z.string()).optional().describe('Programming languages involved (e.g., ["typescript", "python"])'),
  model: z.string().optional().describe('AI model to use'),
});

export const codexReviewTool: ToolDefinition<z.infer<typeof reviewSchema>> = {
  name: 'codex_review',
  description:
    'Review code for a feature, component, or Git changes. Codex analyzes the relevant implementation or modified files, providing contextual feedback and improvement suggestions',
  schema: reviewSchema,

  async execute(args) {
    const {
      target,
      focus = ['security', 'performance', 'readability', 'best-practices', 'architecture'],
      languages,
      model = DEFAULT_MODEL,
    } = args;

    let prompt = `Review the following: ${target}\n`;
    prompt += `Focus areas: ${focus.join(', ')}\n`;

    if (languages && languages.length > 0) {
      prompt += `Languages involved: ${languages.join(', ')}\n`;
    }

    prompt += `\nAnalyze the code and provide actionable feedback with severity levels (high/medium/low) for identified issues. Consider the context and purpose of the changes or feature.`;

    const result = await executeCodexCommand(prompt, { model });

    if (!result.success) {
      throw new Error(result.error || 'Failed to perform code review');
    }

    return result.output || 'No review feedback generated';
  },
};
