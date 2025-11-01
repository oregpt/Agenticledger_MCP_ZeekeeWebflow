/**
 * Zod Schemas for Webflow Blog Scraping MCP Server
 *
 * Following AgenticLedger Platform MCP Server Build Pattern v1.0.0
 */

import { z } from 'zod';

/**
 * Schema for webflow_list_posts tool
 * Lists all blog posts from a Webflow blog
 */
export const WebflowListPostsSchema = z.object({
  accessToken: z.string().describe('Authentication token - use "none" for public Webflow blogs (no authentication required for public content)'),
  url: z.string().url().describe('Base URL of the Webflow blog (e.g., "https://www.zircuit.com/blog")'),
  options: z.object({
    maxPosts: z.number().optional().describe('Maximum number of posts to discover (default: 100)'),
    includeMetadata: z.boolean().optional().describe('Include post metadata like author, date, categories (default: true)')
  }).optional().describe('Optional configuration for post listing')
}).describe('List all blog posts from a Webflow-powered blog');

/**
 * Schema for webflow_scrape_post tool
 * Scrapes a single blog post to clean markdown
 */
export const WebflowScrapePostSchema = z.object({
  accessToken: z.string().describe('Authentication token - use "none" for public Webflow blogs (no authentication required for public content)'),
  url: z.string().url().describe('Full URL of the blog post to scrape (e.g., "https://www.zircuit.com/en/blog/zircuit-mainnet-launch")'),
  options: z.object({
    includeMetadata: z.boolean().optional().describe('Include post metadata (author, date, categories) in response (default: true)'),
    includeImages: z.boolean().optional().describe('Include image URLs in markdown (default: true)')
  }).optional().describe('Optional configuration for post scraping')
}).describe('Scrape a single Webflow blog post and convert to clean markdown');

/**
 * Schema for webflow_scrape_multiple tool
 * Scrapes multiple blog posts in batch
 */
export const WebflowScrapeMultipleSchema = z.object({
  accessToken: z.string().describe('Authentication token - use "none" for public Webflow blogs (no authentication required for public content)'),
  urls: z.array(z.string().url()).describe('Array of blog post URLs to scrape'),
  options: z.object({
    includeMetadata: z.boolean().optional().describe('Include post metadata (author, date, categories) in response (default: true)'),
    includeImages: z.boolean().optional().describe('Include image URLs in markdown (default: true)'),
    concurrency: z.number().min(1).max(5).optional().describe('Number of concurrent scraping operations (default: 3, max: 5 for rate limiting)')
  }).optional().describe('Optional configuration for batch scraping')
}).describe('Scrape multiple Webflow blog posts in batch with concurrency control');

/**
 * Schema for webflow_scrape_all tool
 * Auto-discovers and scrapes all posts from a blog
 */
export const WebflowScrapeAllSchema = z.object({
  accessToken: z.string().describe('Authentication token - use "none" for public Webflow blogs (no authentication required for public content)'),
  url: z.string().url().describe('Base URL of the Webflow blog (e.g., "https://www.zircuit.com/blog")'),
  options: z.object({
    maxPosts: z.number().optional().describe('Maximum number of posts to scrape (default: 100)'),
    includeMetadata: z.boolean().optional().describe('Include post metadata (author, date, categories) in response (default: true)'),
    includeImages: z.boolean().optional().describe('Include image URLs in markdown (default: true)'),
    concurrency: z.number().min(1).max(5).optional().describe('Number of concurrent scraping operations (default: 3, max: 5 for rate limiting)')
  }).optional().describe('Optional configuration for full blog scraping')
}).describe('Auto-discover all posts from a Webflow blog and scrape them to markdown');

/**
 * Schema for webflow_search tool
 * Search within scraped blog content
 */
export const WebflowSearchSchema = z.object({
  accessToken: z.string().describe('Authentication token - use "none" for public Webflow blogs (no authentication required for public content)'),
  url: z.string().url().describe('Base URL of the Webflow blog to search (e.g., "https://www.zircuit.com/blog")'),
  query: z.string().describe('Search query to find within blog post content'),
  options: z.object({
    maxResults: z.number().optional().describe('Maximum number of search results to return (default: 10)'),
    includeSnippets: z.boolean().optional().describe('Include content snippets around matches (default: true)'),
    caseSensitive: z.boolean().optional().describe('Make search case-sensitive (default: false)')
  }).optional().describe('Optional configuration for search')
}).describe('Search for a query within Webflow blog post content');
