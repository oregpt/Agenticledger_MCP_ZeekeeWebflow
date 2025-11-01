# ZeekeeWebflowScraper - Execution Guide

## Quick Re-Extraction Command

**When you want to re-scrape the Zircuit blog, just say:**

> "Run the Webflow scraper to extract all Zircuit blog posts"

Or simply:

> "Run Webflow extraction"

---

## What This Does

This will scrape ALL blog posts from https://www.zircuit.com/blog and save them as individual markdown files in a timestamped folder.

---

## Manual Execution Steps

### 1. Navigate to Project Directory

```bash
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\ZeekeeWebflowScraper"
```

### 2. Ensure Dependencies Are Installed

```bash
npm install
npx playwright install chromium  # Only needed first time
```

### 3. Build the Project

```bash
npm run build
```

### 4. Run the Scraper

```bash
node tests/scrape-and-save-zircuit-blog.js
```

---

## Output

The scraper will:

1. **Discover** all blog posts from https://www.zircuit.com/blog
2. **Scrape** each post to clean markdown
3. **Save** to folder: `zircuit-blog-scraped-YYYYMMDD-HHMMSS/`
4. **Create** an `INDEX.md` with links to all posts

### Example Output Structure

```
zircuit-blog-scraped-20251101-143022/
├── INDEX.md
├── from-testnet-to-mainnet-zircuits-journey.md
├── powering-the-limitless-potential-of-web3.md
├── zircuit-launches-new-grants-round.md
├── zircuit-mainnet-launch.md
└── ... (all other posts)
```

### Each Markdown File Contains

```markdown
---
url: https://www.zircuit.com/blog/post-slug
title: Post Title
scraped: 2025-11-01T14:30:22.000Z
author: Author Name (if available)
publishedDate: Date (if available)
---

# Post Title

**Source:** https://www.zircuit.com/blog/post-slug

---

[Clean markdown content of the blog post...]
```

---

## Configuration Options

### Scrape All Posts (Default)

```javascript
const result = await webflowScrapeAll({
  accessToken: 'none',
  url: 'https://www.zircuit.com/blog',
  options: {
    maxPosts: 100,        // Maximum posts to scrape
    includeMetadata: true,
    includeImages: true,
    concurrency: 3        // Parallel scraping (3-5 recommended)
  }
});
```

### Scrape Only Recent Posts

Modify `tests/scrape-and-save-zircuit-blog.js`:

```javascript
options: {
  maxPosts: 10,  // Only scrape 10 most recent
  concurrency: 5
}
```

### Faster Scraping (No Images)

```javascript
options: {
  includeImages: false,  // Skip images for faster scraping
  concurrency: 5
}
```

---

## Performance Expectations

Based on testing with Zircuit blog:

- **Discovery:** ~7-10 seconds for ~10 posts
- **Single Post:** ~14 seconds
- **Batch (3 posts):** ~28 seconds with concurrency: 2
- **Full Blog (50 posts):** ~4-7 minutes with concurrency: 3

### Optimization Tips

1. **Increase concurrency** to 5 for faster scraping (if network allows)
2. **Set maxPosts** to limit scope: `maxPosts: 20` for recent posts only
3. **Disable images** if not needed: `includeImages: false`
4. **Run during off-peak** hours if scraping large blogs

---

## Troubleshooting

### Error: "Playwright not installed"

```bash
npx playwright install chromium
```

### Error: "No posts found"

- Check that the blog URL is correct
- Verify the blog is publicly accessible
- The blog structure may have changed (check selectors in `src/scraper.ts`)

### Slow Performance

- Reduce concurrency: `concurrency: 2`
- Limit posts: `maxPosts: 10`
- Check internet connection speed

### Memory Issues (Large Blogs)

- Scrape in smaller batches
- Set `maxPosts: 25` and run multiple times
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 node tests/scrape-and-save-zircuit-blog.js`

---

## What Gets Extracted

### ✅ Content Included

- Blog post title
- Full article content (converted to markdown)
- Author (if available)
- Published date (if available)
- Categories/tags (if available)
- Images (if `includeImages: true`)
- Headings, lists, code blocks, quotes
- Links (preserved in markdown)

### ❌ Not Included

- Navigation menus
- Sidebars
- Footer content
- Comments section
- Related posts widgets
- JavaScript functionality

---

## Re-Running the Scraper

### To Get Latest Posts

Simply run the scraper again. It will create a new timestamped folder with the latest content.

```bash
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\ZeekeeWebflowScraper"
npm run build
node tests/scrape-and-save-zircuit-blog.js
```

### To Track Changes Over Time

Keep multiple scrape folders:

```
zircuit-blog-scraped-20251101-120000/  # First run
zircuit-blog-scraped-20251115-120000/  # Two weeks later
zircuit-blog-scraped-20251201-120000/  # One month later
```

Compare folders to see new posts or content changes.

---

## Using Scraped Content

### Search Across All Posts

```bash
# Search for keyword in all markdown files
grep -r "mainnet" zircuit-blog-scraped-*/
```

### Convert to Other Formats

```bash
# Convert to PDF (using pandoc)
pandoc post.md -o post.pdf

# Convert to HTML
pandoc post.md -o post.html
```

### Import to Documentation Tools

The markdown files are compatible with:
- Obsidian
- Notion (import .md files)
- GitBook
- Docusaurus
- MkDocs
- Jekyll/Hugo static sites

---

## Target Sites

**Primary Target:** Zircuit Blog
- URL: https://www.zircuit.com/blog
- Type: Webflow CMS
- Posts: ~47 (as of Nov 2025)
- Update Frequency: Regular

**Should Work With:**
- Any Webflow-powered blog
- Sites with `/blog/` or `/en/blog/` URL structure
- Dynamic content loading blogs

**May Not Work With:**
- Sites requiring authentication
- Rate-limited APIs
- Non-Webflow platforms (use appropriate scraper)
- Sites with aggressive bot protection

---

## Command Summary

```bash
# Full workflow
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\ZeekeeWebflowScraper"
npm install
npm run build
node tests/scrape-and-save-zircuit-blog.js

# Quick re-run (if already installed)
cd "C:\Users\oreph\Documents\AgenticLedger\Custom MCP SERVERS\ZeekeeWebflowScraper"
npm run build && node tests/scrape-and-save-zircuit-blog.js

# Test only (no scraping)
npm run test:zircuit
```

---

## Support

**Issues?** Check:
1. `README.md` - Full documentation
2. `tests/test-zircuit-blog.js` - Example usage
3. GitHub: https://github.com/oregpt/Agenticledger_MCP_ZeekeeWebflow

---

**Last Updated:** November 1, 2025
**Target:** Zircuit Blog (https://www.zircuit.com/blog)
**Status:** Production Ready
