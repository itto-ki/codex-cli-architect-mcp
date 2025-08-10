import { describe, expect, it, vi } from 'vitest';
import * as codexExecutor from '../utils/codexExecutor';
import { codexExplainTool } from './explain.tool';

vi.mock('../utils/codexExecutor');

describe('Codex Explain Tool', () => {
  it('should have correct metadata', () => {
    expect(codexExplainTool.name).toBe('codex_explain');
    expect(codexExplainTool.description).toContain('explanations of code or concepts');
  });

  it('should validate required target field', () => {
    const validInput = {
      target: 'const sum = (a, b) => a + b;',
    };

    expect(() => codexExplainTool.schema.parse(validInput)).not.toThrow();
  });

  it('should reject empty target', () => {
    const invalidInput = {
      target: '',
    };

    expect(() => codexExplainTool.schema.parse(invalidInput)).toThrow();
  });

  it('should handle explanation with target', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'This is an arrow function that adds two numbers',
      exitCode: 0,
    });

    const result = await codexExplainTool.execute({
      target: 'const sum = (a, b) => a + b;',
    });

    expect(result).toBe('This is an arrow function that adds two numbers');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Explain the following'),
      expect.objectContaining({ model: 'gpt-5' })
    );
  });

  it('should handle explanation with language specified', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'TypeScript arrow function explanation',
      exitCode: 0,
    });

    const result = await codexExplainTool.execute({
      target: 'const sum = (a: number, b: number): number => a + b;',
      language: 'typescript',
    });

    expect(result).toBe('TypeScript arrow function explanation');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('(typescript)'),
      expect.any(Object)
    );
  });

  it('should handle concept explanation', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Event loop explanation',
      exitCode: 0,
    });

    const result = await codexExplainTool.execute({
      target: 'How does the event loop work in Node.js?',
    });

    expect(result).toBe('Event loop explanation');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Explain the following'),
      expect.any(Object)
    );
  });

  it('should use custom model when provided', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Explanation with custom model',
      exitCode: 0,
    });

    await codexExplainTool.execute({
      target: 'test code',
      model: 'gpt-4',
    });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ model: 'gpt-4' })
    );
  });

  it('should handle execution failure', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: false,
      error: 'Failed to generate explanation',
    });

    await expect(
      codexExplainTool.execute({
        target: 'test code',
      })
    ).rejects.toThrow('Failed to generate explanation');
  });

  it('should handle empty output', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: '',
      exitCode: 0,
    });

    const result = await codexExplainTool.execute({
      target: 'test code',
    });

    expect(result).toBe('No explanation generated');
  });
});
