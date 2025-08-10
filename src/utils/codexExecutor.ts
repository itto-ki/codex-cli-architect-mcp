import { spawn } from 'node:child_process';
import { EXECUTION_TIMEOUT } from '../constants.js';
import type { CodexExecutionOptions, CodexResponse } from '../types/index.js';
import logger from './logger.js';

export async function executeCodexCommand(
  prompt: string,
  options: CodexExecutionOptions = {}
): Promise<CodexResponse> {
  const { model, timeout = EXECUTION_TIMEOUT } = options;

  // Build command arguments
  const args: string[] = ['exec'];

  if (model) {
    args.push('--model', model);
  }

  // Use read-only sandbox for MCP to only allow reading files
  args.push('--sandbox', 'read-only');

  // Run in full auto mode to prevent interactive prompts
  args.push('--full-auto');

  // Add the prompt as the last argument
  args.push(prompt);

  logger.info('Executing Codex command', { model, prompt: `${prompt.substring(0, 100)}...` });

  return new Promise((resolve) => {
    let output = '';
    let errorOutput = '';
    let timedOut = false;

    const codexProcess = spawn('codex', args, {
      env: { ...process.env },
    });

    const timeoutId = setTimeout(() => {
      timedOut = true;
      codexProcess.kill('SIGTERM');
    }, timeout);

    codexProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    codexProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    codexProcess.on('close', (code) => {
      clearTimeout(timeoutId);

      if (timedOut) {
        resolve({
          success: false,
          error: 'Command execution timed out',
          output: output.trim(),
        });
        return;
      }

      if (code !== 0) {
        resolve({
          success: false,
          error: errorOutput.trim() || 'Codex command failed',
          output: output.trim(),
          exitCode: code || undefined,
        });
        return;
      }

      resolve({
        success: true,
        output: output.trim(),
        exitCode: 0,
      });
    });

    codexProcess.on('error', (error) => {
      clearTimeout(timeoutId);
      logger.error('Codex process error:', error);
      resolve({
        success: false,
        error: error.message,
      });
    });
  });
}
