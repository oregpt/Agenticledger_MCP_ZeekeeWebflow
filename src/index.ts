#!/usr/bin/env node

/**
 * Zeekee Webflow MCP Server
 *
 * Following AgenticLedger Platform MCP Server Build Pattern v1.0.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

import {
  WebflowListPostsSchema,
  WebflowScrapePostSchema,
  WebflowScrapeMultipleSchema,
  WebflowScrapeAllSchema,
  WebflowSearchSchema
} from './schemas.js';

import {
  webflowListPosts,
  webflowScrapePost,
  webflowScrapeMultiple,
  webflowScrapeAll,
  webflowSearch
} from './tools.js';

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: '@agenticledger/zeekee-webflow-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/**
 * List all available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'webflow_list_posts',
        description: WebflowListPostsSchema.description || 'List all blog posts from a Webflow-powered blog',
        inputSchema: zodToJsonSchema(WebflowListPostsSchema)
      },
      {
        name: 'webflow_scrape_post',
        description: WebflowScrapePostSchema.description || 'Scrape a single Webflow blog post and convert to clean markdown',
        inputSchema: zodToJsonSchema(WebflowScrapePostSchema)
      },
      {
        name: 'webflow_scrape_multiple',
        description: WebflowScrapeMultipleSchema.description || 'Scrape multiple Webflow blog posts in batch with concurrency control',
        inputSchema: zodToJsonSchema(WebflowScrapeMultipleSchema)
      },
      {
        name: 'webflow_scrape_all',
        description: WebflowScrapeAllSchema.description || 'Auto-discover all posts from a Webflow blog and scrape them to markdown',
        inputSchema: zodToJsonSchema(WebflowScrapeAllSchema)
      },
      {
        name: 'webflow_search',
        description: WebflowSearchSchema.description || 'Search for a query within Webflow blog post content',
        inputSchema: zodToJsonSchema(WebflowSearchSchema)
      }
    ]
  };
});

/**
 * Handle tool execution requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'webflow_list_posts': {
        const validatedArgs = WebflowListPostsSchema.parse(args);
        const result = await webflowListPosts(validatedArgs);

        if (!result.success) {
          throw new McpError(ErrorCode.InternalError, result.error || 'Unknown error');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'webflow_scrape_post': {
        const validatedArgs = WebflowScrapePostSchema.parse(args);
        const result = await webflowScrapePost(validatedArgs);

        if (!result.success) {
          throw new McpError(ErrorCode.InternalError, result.error || 'Unknown error');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'webflow_scrape_multiple': {
        const validatedArgs = WebflowScrapeMultipleSchema.parse(args);
        const result = await webflowScrapeMultiple(validatedArgs);

        if (!result.success) {
          throw new McpError(ErrorCode.InternalError, result.error || 'Unknown error');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'webflow_scrape_all': {
        const validatedArgs = WebflowScrapeAllSchema.parse(args);
        const result = await webflowScrapeAll(validatedArgs);

        if (!result.success) {
          throw new McpError(ErrorCode.InternalError, result.error || 'Unknown error');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      case 'webflow_search': {
        const validatedArgs = WebflowSearchSchema.parse(args);
        const result = await webflowSearch(validatedArgs);

        if (!result.success) {
          throw new McpError(ErrorCode.InternalError, result.error || 'Unknown error');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2)
            }
          ]
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Validation error: ${error.message}`
      );
    }

    // Generic error handling
    throw new McpError(
      ErrorCode.InternalError,
      error instanceof Error ? error.message : String(error)
    );
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Zeekee Webflow MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
