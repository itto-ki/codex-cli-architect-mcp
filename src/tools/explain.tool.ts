import { z } from 'zod';
import { DEFAULT_MODEL } from '../constants.js';
import type { ToolDefinition } from '../types/index.js';
import { executeCodexCommand } from '../utils/codexExecutor.js';

export const explainSchema = z.object({
  target: z
    .string()
    .min(1)
    .describe('What to explain (e.g., specific files, functions, or concepts)'),
  language: z.string().optional().describe('Programming language (for code explanations)'),
  model: z.string().optional().describe('AI model to use'),
});

export const codexExplainTool: ToolDefinition<z.infer<typeof explainSchema>> = {
  name: 'codex_explain',
  description:
    'Get clear explanations of code or concepts. The MCP client should provide relevant files or context based on the target specification',
  schema: explainSchema,

  async execute(args) {
    const { target, language, model = DEFAULT_MODEL } = args;

    let prompt = `Explain the following${language ? ` (${language})` : ''}:\n\n${target}`;
    prompt += '\n\nProvide a clear and detailed explanation.';

    const result = await executeCodexCommand(prompt, { model });

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate explanation');
    }

    return result.output || 'No explanation generated';
  },
};
