import type { z } from 'zod';

export interface ToolDefinition<T = unknown> {
  name: string;
  description: string;
  schema: z.ZodSchema<T>;
  execute: (args: T) => Promise<string>;
}

export interface CodexExecutionOptions {
  model?: string;
  timeout?: number;
}

export interface CodexResponse {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}
