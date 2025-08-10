import { describe, expect, it, vi } from 'vitest';
import * as codexExecutor from '../utils/codexExecutor';
import { codexConsultTool } from './consult.tool';

vi.mock('../utils/codexExecutor');

describe('Codex Consult Tool', () => {
  it('should have correct metadata', () => {
    expect(codexConsultTool.name).toBe('codex_consult');
    expect(codexConsultTool.description).toContain('Technical consultation');
  });

  it('should validate required fields', () => {
    const validInput = {
      topic: 'architecture',
      question: 'How to design a microservices system?',
    };

    expect(() => codexConsultTool.schema.parse(validInput)).not.toThrow();
  });

  it('should reject invalid topic', () => {
    const invalidInput = {
      topic: 'invalid-topic',
      question: 'Some question',
    };

    expect(() => codexConsultTool.schema.parse(invalidInput)).toThrow();
  });

  it('should execute consultation request', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: true,
      output: 'Consultation response',
      exitCode: 0,
    });

    const result = await codexConsultTool.execute({
      topic: 'architecture',
      question: 'How to design a REST API?',
    });

    expect(result).toBe('Consultation response');
    expect(mockExecute).toHaveBeenCalledWith(
      expect.stringContaining('architecture'),
      expect.objectContaining({ model: 'gpt-5' })
    );
  });

  it('should handle execution failure', async () => {
    const mockExecute = vi.spyOn(codexExecutor, 'executeCodexCommand');
    mockExecute.mockResolvedValue({
      success: false,
      error: 'Command failed',
    });

    await expect(
      codexConsultTool.execute({
        topic: 'architecture',
        question: 'Test question',
      })
    ).rejects.toThrow('Command failed');
  });
});
