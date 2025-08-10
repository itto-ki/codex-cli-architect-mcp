import { z } from 'zod';
import { DEFAULT_MODEL } from '../constants.js';
import type { ToolDefinition } from '../types/index.js';
import { executeCodexCommand } from '../utils/codexExecutor.js';

export const consultSchema = z.object({
  topic: z
    .enum(['architecture', 'design-pattern', 'tech-stack', 'implementation'])
    .describe('Type of consultation'),
  question: z.string().min(1).describe('Your technical question or design problem'),
  context: z.string().optional().describe('Additional context about your situation'),
  constraints: z.array(z.string()).optional().describe('Technical constraints or requirements'),
  model: z.string().optional().describe('AI model to use'),
});

export const codexConsultTool: ToolDefinition<z.infer<typeof consultSchema>> = {
  name: 'codex_consult',
  description:
    'Technical consultation for architecture decisions, design patterns, technology choices, and implementation strategies',
  schema: consultSchema,

  async execute(args) {
    const { topic, question, context, constraints = [], model = DEFAULT_MODEL } = args;

    let prompt = `As a senior technical consultant, provide expert advice on the following ${topic} question:\n\n`;
    prompt += `Question: ${question}\n`;

    if (context) {
      prompt += `Context: ${context}\n`;
    }

    if (constraints.length > 0) {
      prompt += `Constraints: ${constraints.join(', ')}\n`;
    }

    const result = await executeCodexCommand(prompt, { model });

    if (!result.success) {
      throw new Error(result.error || 'Failed to provide consultation');
    }

    return result.output || 'No consultation response generated';
  },
};
