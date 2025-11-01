/**
 * Integration tests for Zeekee Webflow MCP Server
 * Testing against real Zircuit blog: https://www.zircuit.com/blog
 */

import {
  webflowListPosts,
  webflowScrapePost,
  webflowScrapeMultiple,
  webflowScrapeAll,
  webflowSearch
} from '../dist/tools.js';

console.log('============================================================');
console.log('  ZEEKEE WEBFLOW MCP SERVER - INTEGRATION TESTS');
console.log('  Testing against: https://www.zircuit.com/blog');
console.log('============================================================\n');

const TEST_BASE_URL = 'https://www.zircuit.com/blog';
const ACCESS_TOKEN = 'none'; // Public blog, no auth needed

let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper
 */
async function runTest(name, fn) {
  try {
    console.log(`\n▶ Test: ${name}`);
    const startTime = Date.now();
    await fn();
    const duration = Date.now() - startTime;
    console.log(`✅ PASSED (${duration}ms)\n`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAILED: ${error.message}\n`);
    testsFailed++;
  }
}

/**
 * Test 1: List Posts
 */
await runTest('List Posts from Zircuit Blog', async () => {
  const result = await webflowListPosts({
    accessToken: ACCESS_TOKEN,
    url: TEST_BASE_URL,
    options: {
      maxPosts: 10,
      includeMetadata: true
    }
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to list posts');
  }

  console.log(`   Base URL: ${result.data.baseUrl}`);
  console.log(`   Total posts discovered: ${result.data.totalPosts}`);
  console.log(`   Sample posts:`);

  result.data.posts.slice(0, 3).forEach((post, i) => {
    console.log(`   ${i + 1}. ${post.title}`);
    console.log(`      URL: ${post.url}`);
    console.log(`      Slug: ${post.slug}`);
  });

  if (result.data.totalPosts === 0) {
    throw new Error('No posts found');
  }
});

/**
 * Test 2: Scrape Single Post
 */
await runTest('Scrape Single Blog Post', async () => {
  // First get a post URL
  const listResult = await webflowListPosts({
    accessToken: ACCESS_TOKEN,
    url: TEST_BASE_URL,
    options: { maxPosts: 1 }
  });

  if (!listResult.success || listResult.data.posts.length === 0) {
    throw new Error('Could not get a post URL for testing');
  }

  const testUrl = listResult.data.posts[0].url;

  const result = await webflowScrapePost({
    accessToken: ACCESS_TOKEN,
    url: testUrl,
    options: {
      includeMetadata: true,
      includeImages: true
    }
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to scrape post');
  }

  console.log(`   URL: ${result.data.url}`);
  console.log(`   Title: ${result.data.metadata.title}`);
  console.log(`   Content length: ${result.data.markdown.length} characters`);
  console.log(`   Published: ${result.data.metadata.publishedDate || 'N/A'}`);
  console.log(`   Author: ${result.data.metadata.author || 'N/A'}`);
  console.log(`\n   Content preview:`);
  console.log(`   "${result.data.markdown.substring(0, 150)}..."\n`);

  if (result.data.markdown.length === 0) {
    throw new Error('No content scraped');
  }
});

/**
 * Test 3: Scrape Multiple Posts
 */
await runTest('Scrape Multiple Posts (Batch)', async () => {
  // Get 3 post URLs
  const listResult = await webflowListPosts({
    accessToken: ACCESS_TOKEN,
    url: TEST_BASE_URL,
    options: { maxPosts: 3 }
  });

  if (!listResult.success || listResult.data.posts.length === 0) {
    throw new Error('Could not get post URLs for testing');
  }

  const testUrls = listResult.data.posts.map(post => post.url);

  const result = await webflowScrapeMultiple({
    accessToken: ACCESS_TOKEN,
    urls: testUrls,
    options: {
      includeMetadata: true,
      concurrency: 2
    }
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to scrape multiple posts');
  }

  console.log(`   Requested URLs: ${testUrls.length}`);
  console.log(`   Successful scrapes: ${result.data.totalPosts}`);
  console.log(`   Total characters: ${result.data.totalCharacters.toLocaleString()}`);
  console.log(`\n   Scraped posts:`);

  result.data.posts.forEach((post, i) => {
    console.log(`   ${i + 1}. ${post.metadata.title} (${post.markdown.length} chars)`);
  });

  if (result.data.totalPosts === 0) {
    throw new Error('No posts scraped');
  }
});

/**
 * Test 4: Validation Error - Missing accessToken
 */
await runTest('Validation - Missing accessToken', async () => {
  const result = await webflowListPosts({
    accessToken: '',
    url: TEST_BASE_URL
  });

  if (result.success) {
    throw new Error('Should have failed validation');
  }

  console.log(`   Expected error: ${result.error}`);

  if (!result.error || !result.error.includes('accessToken')) {
    throw new Error('Wrong error message');
  }
});

/**
 * Test 5: Error Handling - Invalid URL
 */
await runTest('Error Handling - Invalid URL', async () => {
  const result = await webflowScrapePost({
    accessToken: ACCESS_TOKEN,
    url: 'https://invalid-url-that-does-not-exist-12345.com/blog/post'
  });

  if (result.success) {
    throw new Error('Should have failed with invalid URL');
  }

  console.log(`   Expected error: ${result.error}`);

  if (!result.error) {
    throw new Error('Missing error message');
  }
});

/**
 * Test Summary
 */
console.log('\n============================================================');
console.log('  TEST SUMMARY');
console.log('============================================================');
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📊 Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n🎉 ALL TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed\n`);
  process.exit(1);
}
