/**
 * Webflow Blog Scraping Tools
 *
 * Following AgenticLedger Platform MCP Server Build Pattern v1.0.0
 * All tools follow the standard response format: { success: boolean, data?: any, error?: string }
 */

import {
  extractBlogPosts,
  scrapePost,
  scrapeMultiplePosts,
  searchPosts,
  type BlogPost,
  type ScrapedPost
} from './scraper.js';

/**
 * Tool 1: webflow_list_posts
 * Lists all blog posts from a Webflow blog
 */
export async function webflowListPosts(params: {
  accessToken: string;
  url: string;
  options?: {
    maxPosts?: number;
    includeMetadata?: boolean;
  };
}): Promise<{
  success: boolean;
  data?: {
    posts: BlogPost[];
    totalPosts: number;
    baseUrl: string;
  };
  error?: string;
}> {
  try {
    // Validate accessToken (even though we don't use it for public blogs)
    if (!params.accessToken) {
      return {
        success: false,
        error: 'accessToken is required (use "none" for public blogs)'
      };
    }

    const posts = await extractBlogPosts(params.url, {
      maxPosts: params.options?.maxPosts,
      includeMetadata: params.options?.includeMetadata !== false
    });

    if (posts.length === 0) {
      return {
        success: false,
        error: `No blog posts found at ${params.url}. This may not be a Webflow blog, or the blog structure is different than expected.`
      };
    }

    return {
      success: true,
      data: {
        posts,
        totalPosts: posts.length,
        baseUrl: params.url
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to list posts from ${params.url}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tool 2: webflow_scrape_post
 * Scrapes a single blog post to clean markdown
 */
export async function webflowScrapePost(params: {
  accessToken: string;
  url: string;
  options?: {
    includeMetadata?: boolean;
    includeImages?: boolean;
  };
}): Promise<{
  success: boolean;
  data?: ScrapedPost;
  error?: string;
}> {
  try {
    // Validate accessToken
    if (!params.accessToken) {
      return {
        success: false,
        error: 'accessToken is required (use "none" for public blogs)'
      };
    }

    const post = await scrapePost(params.url, {
      includeMetadata: params.options?.includeMetadata !== false,
      includeImages: params.options?.includeImages !== false
    });

    if (!post.markdown || post.markdown.length === 0) {
      return {
        success: false,
        error: `No content found at ${params.url}. The page may be empty or the content structure is different than expected.`
      };
    }

    return {
      success: true,
      data: post
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to scrape post from ${params.url}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tool 3: webflow_scrape_multiple
 * Scrapes multiple blog posts in batch
 */
export async function webflowScrapeMultiple(params: {
  accessToken: string;
  urls: string[];
  options?: {
    includeMetadata?: boolean;
    includeImages?: boolean;
    concurrency?: number;
  };
}): Promise<{
  success: boolean;
  data?: {
    posts: ScrapedPost[];
    totalPosts: number;
    totalCharacters: number;
  };
  error?: string;
}> {
  try {
    // Validate accessToken
    if (!params.accessToken) {
      return {
        success: false,
        error: 'accessToken is required (use "none" for public blogs)'
      };
    }

    // Validate URLs array
    if (!params.urls || params.urls.length === 0) {
      return {
        success: false,
        error: 'urls array is required and must contain at least one URL'
      };
    }

    const posts = await scrapeMultiplePosts(params.urls, {
      includeMetadata: params.options?.includeMetadata !== false,
      includeImages: params.options?.includeImages !== false,
      concurrency: params.options?.concurrency
    });

    if (posts.length === 0) {
      return {
        success: false,
        error: `Failed to scrape any posts from the provided ${params.urls.length} URLs. Check that the URLs are valid Webflow blog posts.`
      };
    }

    const totalCharacters = posts.reduce((sum, post) => sum + post.markdown.length, 0);

    return {
      success: true,
      data: {
        posts,
        totalPosts: posts.length,
        totalCharacters
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to scrape multiple posts: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tool 4: webflow_scrape_all
 * Auto-discovers and scrapes all posts from a blog
 */
export async function webflowScrapeAll(params: {
  accessToken: string;
  url: string;
  options?: {
    maxPosts?: number;
    includeMetadata?: boolean;
    includeImages?: boolean;
    concurrency?: number;
  };
}): Promise<{
  success: boolean;
  data?: {
    posts: ScrapedPost[];
    totalPosts: number;
    totalCharacters: number;
    metadata: {
      discoveredPosts: number;
      scrapedPosts: number;
      baseUrl: string;
    };
  };
  error?: string;
}> {
  try {
    // Validate accessToken
    if (!params.accessToken) {
      return {
        success: false,
        error: 'accessToken is required (use "none" for public blogs)'
      };
    }

    // Step 1: Discover all posts
    const discoveredPosts = await extractBlogPosts(params.url, {
      maxPosts: params.options?.maxPosts,
      includeMetadata: true
    });

    if (discoveredPosts.length === 0) {
      return {
        success: false,
        error: `No blog posts found at ${params.url}. This may not be a Webflow blog, or the blog structure is different than expected.`
      };
    }

    // Step 2: Scrape all discovered posts
    const postUrls = discoveredPosts.map(post => post.url);
    const scrapedPosts = await scrapeMultiplePosts(postUrls, {
      includeMetadata: params.options?.includeMetadata !== false,
      includeImages: params.options?.includeImages !== false,
      concurrency: params.options?.concurrency
    });

    if (scrapedPosts.length === 0) {
      return {
        success: false,
        error: `Discovered ${discoveredPosts.length} posts but failed to scrape any of them. Check the blog structure.`
      };
    }

    const totalCharacters = scrapedPosts.reduce((sum, post) => sum + post.markdown.length, 0);

    return {
      success: true,
      data: {
        posts: scrapedPosts,
        totalPosts: scrapedPosts.length,
        totalCharacters,
        metadata: {
          discoveredPosts: discoveredPosts.length,
          scrapedPosts: scrapedPosts.length,
          baseUrl: params.url
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to scrape all posts from ${params.url}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Tool 5: webflow_search
 * Search within blog post content
 */
export async function webflowSearch(params: {
  accessToken: string;
  url: string;
  query: string;
  options?: {
    maxResults?: number;
    includeSnippets?: boolean;
    caseSensitive?: boolean;
  };
}): Promise<{
  success: boolean;
  data?: {
    results: Array<{
      url: string;
      title: string;
      snippet?: string;
      matchCount: number;
    }>;
    totalResults: number;
    query: string;
  };
  error?: string;
}> {
  try {
    // Validate accessToken
    if (!params.accessToken) {
      return {
        success: false,
        error: 'accessToken is required (use "none" for public blogs)'
      };
    }

    // Validate query
    if (!params.query || params.query.trim().length === 0) {
      return {
        success: false,
        error: 'query parameter is required and cannot be empty'
      };
    }

    // Step 1: Discover and scrape all posts
    const discoveredPosts = await extractBlogPosts(params.url, {
      maxPosts: 100,
      includeMetadata: true
    });

    if (discoveredPosts.length === 0) {
      return {
        success: false,
        error: `No blog posts found at ${params.url} to search.`
      };
    }

    const postUrls = discoveredPosts.map(post => post.url);
    const scrapedPosts = await scrapeMultiplePosts(postUrls, {
      includeMetadata: true,
      includeImages: false, // No need for images in search
      concurrency: 3
    });

    if (scrapedPosts.length === 0) {
      return {
        success: false,
        error: `Failed to scrape posts from ${params.url} for search.`
      };
    }

    // Step 2: Search within scraped content
    const results = searchPosts(scrapedPosts, params.query, {
      maxResults: params.options?.maxResults,
      includeSnippets: params.options?.includeSnippets,
      caseSensitive: params.options?.caseSensitive
    });

    return {
      success: true,
      data: {
        results,
        totalResults: results.length,
        query: params.query
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to search blog at ${params.url}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
