import { codexConsultTool, consultSchema } from './consult.tool.js';
import { codexExplainTool, explainSchema } from './explain.tool.js';
import { codexReviewTool, reviewSchema } from './review.tool.js';

// Export union type of all tools
export type AllTools = typeof codexConsultTool | typeof codexReviewTool | typeof codexExplainTool;

export async function getAllTools(): Promise<AllTools[]> {
  return [codexConsultTool, codexReviewTool, codexExplainTool];
}

export {
  codexConsultTool,
  consultSchema,
  codexExplainTool,
  explainSchema,
  codexReviewTool,
  reviewSchema,
};
