#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { z } from 'zod';
import { SERVER_NAME, SERVER_VERSION } from './constants.js';
import {
  codexConsultTool,
  codexExplainTool,
  codexReviewTool,
  consultSchema,
  explainSchema,
  getAllTools,
  reviewSchema,
} from './tools/index.js';
import logger from './utils/logger.js';

// Create server instance
const server = new McpServer({
  name: SERVER_NAME,
  version: SERVER_VERSION,
});

// Create a generic tool handler with proper typing
function createToolHandler<T extends z.ZodTypeAny>(tool: {
  name: string;
  execute: (args: z.infer<T>) => Promise<string>;
}) {
  return async (args: z.infer<T>) => {
    try {
      logger.info(`Executing tool: ${tool.name}`, args);
      const result = await tool.execute(args);

      return {
        content: [
          {
            type: 'text' as const,
            text: result,
          },
        ],
      };
    } catch (error) {
      logger.error(`Tool execution failed: ${tool.name}`, error);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
      };
    }
  };
}

async function initializeServer() {
  logger.info(`Starting ${SERVER_NAME} v${SERVER_VERSION}`);

  // Debug: Log environment
  logger.debug('Environment:', {
    nodeVersion: process.version,
    cwd: process.cwd(),
    argv: process.argv,
  });

  // Load all tools
  const tools = await getAllTools();
  logger.info(`Loaded ${tools.length} tools`);

  // Register all tools
  const toolConfigs = [
    { tool: codexConsultTool, schema: consultSchema },
    { tool: codexReviewTool, schema: reviewSchema },
    { tool: codexExplainTool, schema: explainSchema },
  ];

  for (const { tool, schema } of toolConfigs) {
    server.tool(tool.name, tool.description, schema.shape, createToolHandler(tool));
  }

  const transport = new StdioServerTransport();

  // Add connection event logging
  transport.onclose = () => {
    logger.info('Transport closed');
  };

  await server.connect(transport);

  logger.info('Server connected and ready');
  logger.info(`MCP server listening on stdio`);

  // Log server capabilities for debugging
  logger.debug('Server initialized with capabilities:', {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    toolsEnabled: true,
    toolCount: tools.length,
  });
}

// Error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
initializeServer().catch((error) => {
  logger.error('Failed to initialize server:', error);
  process.exit(1);
});
