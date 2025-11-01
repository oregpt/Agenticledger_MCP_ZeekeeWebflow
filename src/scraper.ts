/**
 * Webflow Blog Scraping Logic
 *
 * Core functions for extracting blog posts from Webflow-powered blogs using Playwright.
 */

import { chromium, Browser, Page } from 'playwright';
import TurndownService from 'turndown';

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_POSTS = 100;
const DEFAULT_CONCURRENCY = 3;

export interface ScraperOptions {
  timeout?: number;
  headless?: boolean;
}

export interface BlogPost {
  title: string;
  url: string;
  slug: string;
  excerpt?: string;
  publishedDate?: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

export interface PostMetadata {
  title: string;
  description?: string;
  url: string;
  publishedDate?: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

export interface ScrapedPost {
  url: string;
  markdown: string;
  metadata: PostMetadata;
}

/**
 * Create a browser instance
 */
async function createBrowser(options?: ScraperOptions): Promise<Browser> {
  return await chromium.launch({
    headless: options?.headless !== false,
    timeout: options?.timeout || DEFAULT_TIMEOUT
  });
}

/**
 * Extract all blog post URLs from Webflow blog
 * Handles dynamic content loading and infinite scroll
 */
export async function extractBlogPosts(
  baseUrl: string,
  options?: ScraperOptions & { maxPosts?: number; includeMetadata?: boolean }
): Promise<BlogPost[]> {
  const browser = await createBrowser(options);
  const posts: BlogPost[] = [];

  try {
    const page = await browser.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: options?.timeout || DEFAULT_TIMEOUT });

    // Wait for blog posts to load
    // Webflow typically uses .w-dyn-item for collection items
    await page.waitForSelector('.w-dyn-item, article, [class*="blog"], [class*="post"]', { timeout: 10000 }).catch(() => {
      // If no posts found with these selectors, continue anyway
    });

    // Scroll to load all posts (handle infinite scroll)
    const maxPosts = options?.maxPosts || DEFAULT_MAX_POSTS;
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (scrollAttempts < maxScrollAttempts) {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(1500); // Wait for content to load

      const currentHeight = await page.evaluate(() => document.body.scrollHeight);

      // Check if we've loaded new content
      if (currentHeight === previousHeight) {
        break; // No more content to load
      }

      previousHeight = currentHeight;
      scrollAttempts++;

      // Check if we've reached max posts
      const currentPostCount = await page.$$eval('a[href*="/blog/"], a[href*="/en/blog/"]', links => links.length);
      if (currentPostCount >= maxPosts) {
        break;
      }
    }

    // Extract blog post links
    const postLinks = await page.$$eval('a[href*="/blog/"], a[href*="/en/blog/"]', (links) => {
      return links
        .map((link) => {
          const href = (link as HTMLAnchorElement).href;
          const title = link.textContent?.trim() || '';

          // Skip links that are just the blog index
          if (href.endsWith('/blog') || href.endsWith('/blog/')) {
            return null;
          }

          return { href, title };
        })
        .filter((item): item is { href: string; title: string } => item !== null && item.title !== '');
    });

    // Deduplicate by URL
    const seen = new Set<string>();
    const uniqueLinks: { href: string; title: string }[] = [];

    for (const link of postLinks) {
      if (!seen.has(link.href)) {
        seen.add(link.href);
        uniqueLinks.push(link);
      }
    }

    // Limit to maxPosts
    const limitedLinks = uniqueLinks.slice(0, maxPosts);

    // Extract metadata if requested
    if (options?.includeMetadata) {
      for (const link of limitedLinks) {
        const slug = extractSlugFromUrl(link.href);
        posts.push({
          title: link.title,
          url: link.href,
          slug
        });
      }
    } else {
      for (const link of limitedLinks) {
        const slug = extractSlugFromUrl(link.href);
        posts.push({
          title: link.title,
          url: link.href,
          slug
        });
      }
    }

    await page.close();
  } finally {
    await browser.close();
  }

  return posts;
}

/**
 * Scrape a single Webflow blog post
 */
export async function scrapePost(
  url: string,
  options?: ScraperOptions & { includeMetadata?: boolean; includeImages?: boolean }
): Promise<ScrapedPost> {
  const browser = await createBrowser(options);

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: options?.timeout || DEFAULT_TIMEOUT });

    // Wait for main content to load
    await page.waitForSelector('article, main, [class*="content"], [class*="post"]', { timeout: 10000 }).catch(() => {
      // Continue even if specific selector not found
    });

    // Extract metadata
    const metadata: PostMetadata = {
      title: await extractTitle(page),
      description: await extractDescription(page),
      url,
      publishedDate: await extractPublishedDate(page),
      author: await extractAuthor(page),
      categories: await extractCategories(page),
      imageUrl: await extractFeaturedImage(page)
    };

    // Extract main content
    const htmlContent = await page.evaluate(() => {
      // Try to find the main article content
      const selectors = [
        'article',
        'main',
        '[class*="post-content"]',
        '[class*="article-content"]',
        '[class*="blog-content"]',
        '.w-richtext',
        '[class*="rich-text"]'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Remove navigation, footer, sidebar
          const clone = element.cloneNode(true) as Element;
          clone.querySelectorAll('nav, header, footer, aside, [class*="sidebar"], [class*="navigation"]').forEach(el => el.remove());
          clone.querySelectorAll('script, style, iframe').forEach(el => el.remove());
          return clone.innerHTML;
        }
      }

      // Fallback to body
      const body = document.body.cloneNode(true) as Element;
      body.querySelectorAll('nav, header, footer, aside, [class*="sidebar"], [class*="navigation"]').forEach(el => el.remove());
      body.querySelectorAll('script, style, iframe').forEach(el => el.remove());
      return body.innerHTML;
    });

    // Convert HTML to Markdown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });

    // Add custom rule for images
    if (!options?.includeImages) {
      turndownService.addRule('removeImages', {
        filter: 'img',
        replacement: () => ''
      });
    }

    const markdown = turndownService.turndown(htmlContent);

    await page.close();

    return {
      url,
      markdown: markdown.trim(),
      metadata
    };
  } finally {
    await browser.close();
  }
}

/**
 * Scrape multiple posts with concurrency control
 */
export async function scrapeMultiplePosts(
  urls: string[],
  options?: ScraperOptions & { includeMetadata?: boolean; includeImages?: boolean; concurrency?: number }
): Promise<ScrapedPost[]> {
  const concurrency = Math.min(options?.concurrency || DEFAULT_CONCURRENCY, 5);
  const results: ScrapedPost[] = [];
  const errors: Array<{ url: string; error: string }> = [];

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);

    const batchPromises = batch.map(async (url) => {
      try {
        const post = await scrapePost(url, options);
        return { success: true, post };
      } catch (error) {
        return {
          success: false,
          url,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      if (result.success && 'post' in result && result.post) {
        results.push(result.post);
      } else if (!result.success && 'url' in result && result.url && result.error) {
        errors.push({ url: result.url, error: result.error });
      }
    }

    // Add delay between batches
    if (i + concurrency < urls.length) {
      await delay(2000); // Longer delay for Webflow to avoid rate limiting
    }
  }

  if (errors.length > 0) {
    console.warn(`Failed to scrape ${errors.length} posts:`, errors);
  }

  return results;
}

/**
 * Helper: Extract title from page
 */
async function extractTitle(page: Page): Promise<string> {
  return await page.evaluate(() => {
    // Try various selectors
    const selectors = [
      'h1',
      '[class*="title"]',
      'article h1',
      'meta[property="og:title"]',
      'title'
    ];

    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta?.content) return meta.content;
      } else {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) return element.textContent.trim();
      }
    }

    return 'Untitled';
  });
}

/**
 * Helper: Extract description from page
 */
async function extractDescription(page: Page): Promise<string | undefined> {
  return await page.evaluate(() => {
    const meta = document.querySelector('meta[name="description"], meta[property="og:description"]') as HTMLMetaElement;
    return meta?.content || undefined;
  });
}

/**
 * Helper: Extract published date from page
 */
async function extractPublishedDate(page: Page): Promise<string | undefined> {
  return await page.evaluate(() => {
    const selectors = [
      'time[datetime]',
      '[class*="date"]',
      'meta[property="article:published_time"]'
    ];

    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta?.content) return meta.content;
      } else if (selector === 'time[datetime]') {
        const time = document.querySelector(selector) as HTMLTimeElement;
        if (time?.dateTime) return time.dateTime;
      } else {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) return element.textContent.trim();
      }
    }

    return undefined;
  });
}

/**
 * Helper: Extract author from page
 */
async function extractAuthor(page: Page): Promise<string | undefined> {
  return await page.evaluate(() => {
    const selectors = [
      '[class*="author"]',
      'meta[name="author"]',
      'meta[property="article:author"]'
    ];

    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta?.content) return meta.content;
      } else {
        const element = document.querySelector(selector);
        if (element?.textContent?.trim()) return element.textContent.trim();
      }
    }

    return undefined;
  });
}

/**
 * Helper: Extract categories from page
 */
async function extractCategories(page: Page): Promise<string[] | undefined> {
  return await page.evaluate(() => {
    const categories: string[] = [];

    // Try to find category links or tags
    const categoryElements = document.querySelectorAll('[class*="category"], [class*="tag"], [rel="category"]');
    categoryElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && !categories.includes(text)) {
        categories.push(text);
      }
    });

    return categories.length > 0 ? categories : undefined;
  });
}

/**
 * Helper: Extract featured image from page
 */
async function extractFeaturedImage(page: Page): Promise<string | undefined> {
  return await page.evaluate(() => {
    const selectors = [
      'meta[property="og:image"]',
      '[class*="featured-image"] img',
      'article img',
      'img[class*="hero"]'
    ];

    for (const selector of selectors) {
      if (selector.startsWith('meta')) {
        const meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta?.content) return meta.content;
      } else {
        const img = document.querySelector(selector) as HTMLImageElement;
        if (img?.src) return img.src;
      }
    }

    return undefined;
  });
}

/**
 * Helper: Extract slug from URL
 */
function extractSlugFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(p => p);
    return parts[parts.length - 1] || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Helper: Delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search within scraped blog posts
 */
export function searchPosts(
  posts: ScrapedPost[],
  query: string,
  options?: {
    maxResults?: number;
    includeSnippets?: boolean;
    caseSensitive?: boolean;
  }
): Array<{
  url: string;
  title: string;
  snippet?: string;
  matchCount: number;
}> {
  const maxResults = options?.maxResults || 10;
  const includeSnippets = options?.includeSnippets !== false;
  const caseSensitive = options?.caseSensitive || false;

  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const results: Array<{
    url: string;
    title: string;
    snippet?: string;
    matchCount: number;
  }> = [];

  for (const post of posts) {
    const content = caseSensitive ? post.markdown : post.markdown.toLowerCase();

    // Count matches
    const matches = content.split(searchQuery).length - 1;

    if (matches > 0) {
      let snippet: string | undefined;

      if (includeSnippets) {
        // Find first occurrence and extract surrounding context
        const index = content.indexOf(searchQuery);
        if (index !== -1) {
          const start = Math.max(0, index - 100);
          const end = Math.min(content.length, index + searchQuery.length + 100);
          snippet = '...' + post.markdown.substring(start, end) + '...';
        }
      }

      results.push({
        url: post.url,
        title: post.metadata.title,
        snippet,
        matchCount: matches
      });
    }
  }

  // Sort by match count (descending)
  results.sort((a, b) => b.matchCount - a.matchCount);

  return results.slice(0, maxResults);
}
