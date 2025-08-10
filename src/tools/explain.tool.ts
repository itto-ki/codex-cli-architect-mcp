import { z } from 'zod';
import { DEFAULT_MODEL } from '../constants.js';
import type { ToolDefinition } from '../types/index.js';
import { executeCodexCommand } from '../utils/codexExecutor.js';

export const explainSchema = z.object({
  target: z
    .string()
    .min(1)
    .describe(
      'What to explain - feature/component (e.g., "authentication flow"), Git context (e.g., "recent commits", "changes in PR"), or concept'
    ),
  languages: z
    .array(z.string())
    .optional()
    .describe('Programming languages involved (e.g., ["javascript", "sql"])'),
  model: z.string().optional().describe('AI model to use'),
});

export const codexExplainTool: ToolDefinition<z.infer<typeof explainSchema>> = {
  name: 'codex_explain',
  description:
    'Explain code, features, or changes. Codex examines the implementation, Git history, or conceptual design to provide comprehensive explanations',
  schema: explainSchema,

  async execute(args) {
    const { target, languages, model = DEFAULT_MODEL } = args;

    let prompt = `Explain the following`;
    if (languages && languages.length > 0) {
      prompt += ` (${languages.join(', ')})`;
    }
    prompt += `:\n\n${target}`;
    prompt += '\n\nProvide a clear and detailed explanation.';

    const result = await executeCodexCommand(prompt, { model });

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate explanation');
    }

    return result.output || 'No explanation generated';
  },
};
