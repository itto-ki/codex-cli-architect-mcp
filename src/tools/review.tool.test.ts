import { describe, expect, it, vi } from 'vitest';
import * as codexExecutor from '../utils/codexExecutor';
import { codexReviewTool } from './review.tool';

vi.mock('../utils/codexExecutor');

describe('Codex Review Tool', () => {
  it('should have correct metadata', () => {
    expect(codexReviewTool.name).toBe('codex_review');
    expect(codexReviewTool.description).toContain('Review code');
  });

  it('should validate required target field', () => {
    const validInput = {
      target: 'src/utils/math.ts',
    };

    expect(() => codexReviewTool.schema.parse(validInput)).not.toThrow();
  });

  it('should reject empty target', () => {
    const invalidInput = {
      target: '',
    };

    expect(() => codexReviewTool.schema.parse(invalidInput)).toThrow();
  });

  it('should handle code review with default focus areas', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Code looks good with minor suggestions',
      exitCode: 0,
    });

    const result = await codexReviewTool.execute({
      target: 'src/utils/math.ts',
    });

    expect(result).toBe('Code looks good with minor suggestions');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('security, performance, readability, best-practices, architecture'),
      expect.objectContaining({ model: 'gpt-5' })
    );
  });

  it('should handle code review with custom focus areas', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Security issues found',
      exitCode: 0,
    });

    const result = await codexReviewTool.execute({
      target: 'modified files',
      focus: ['security'],
    });

    expect(result).toBe('Security issues found');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Focus areas: security'),
      expect.any(Object)
    );
  });

  it('should include languages when specified', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Multi-language code review results',
      exitCode: 0,
    });

    const result = await codexReviewTool.execute({
      target: 'full-stack feature',
      languages: ['typescript', 'python'],
    });

    expect(result).toBe('Multi-language code review results');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Languages involved: typescript, python'),
      expect.any(Object)
    );
  });

  it('should handle single language in array', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'TypeScript review',
      exitCode: 0,
    });

    const result = await codexReviewTool.execute({
      target: 'src/app.ts',
      languages: ['typescript'],
    });

    expect(result).toBe('TypeScript review');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Languages involved: typescript'),
      expect.any(Object)
    );
  });

  it('should handle multiple focus areas', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Performance and security review',
      exitCode: 0,
    });

    await codexReviewTool.execute({
      target: 'staged changes',
      focus: ['performance', 'security'],
    });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('Focus areas: performance, security'),
      expect.any(Object)
    );
  });

  it('should use custom model when provided', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Review with custom model',
      exitCode: 0,
    });

    await codexReviewTool.execute({
      target: 'test.js',
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
      error: 'Failed to perform code review',
    });

    await expect(
      codexReviewTool.execute({
        target: 'test.js',
      })
    ).rejects.toThrow('Failed to perform code review');
  });

  it('should handle empty output', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: '',
      exitCode: 0,
    });

    const result = await codexReviewTool.execute({
      target: 'test.js',
    });

    expect(result).toBe('No review feedback generated');
  });

  it('should validate focus area enum values', () => {
    const validInput = {
      target: 'test.js',
      focus: ['security', 'performance'],
    };

    expect(() => codexReviewTool.schema.parse(validInput)).not.toThrow();

    const invalidInput = {
      target: 'test.js',
      focus: ['invalid-focus'],
    };

    expect(() => codexReviewTool.schema.parse(invalidInput)).toThrow();
  });
});
