# Perplexity Scraper Documentation

## Overview
The Perplexity scraper extracts conversations from perplexity.ai, handling unique features like citations, search results, and copilot mode metadata.

## Features
- Citation extraction
- Search result tracking
- Copilot mode metadata
- "Load More" pagination
- Multiple authentication providers

## Implementation Details

### Authentication
```javascript
await this.page.goto('https://perplexity.ai');
await this.page.waitForSelector('div[role="list"][aria-label="Conversations"]');
```
Supports multiple auth providers. Waits for conversation list to confirm authentication.

### Conversation Structure
Each conversation contains:
- Unique Perplexity ID
- Title
- Messages with citations
- Search results
- Copilot mode settings
- Timestamps

### Citation Processing
Extracts detailed citation information:
```javascript
const citations = await messageElement.$$('[data-citation]');
content.citations = await Promise.all(citations.map(async citation => ({
    text: await citation.$eval('[data-citation-text]', el => el.textContent),
    url: await citation.getAttribute('data-citation-url'),
    title: await citation.getAttribute('data-citation-title')
})));
```

### Search Results
Captures Perplexity's search integration:
```javascript
async getSearchResults() {
    const results = await this.page.$$('[data-search-result]');
    return await Promise.all(results.map(async result => ({
        title: await result.$eval('[data-result-title]', el => el.textContent),
        url: await result.$eval('[data-result-url]', el => el.getAttribute('href')),
        snippet: await result.$eval('[data-result-snippet]', el => el.textContent)
    })));
}
```

## Usage Example
```javascript
const scraper = new PerplexityScraper();
await scraper.initialize();
await scraper.authenticate();
const conversations = await scraper.getConversations();
await scraper.cleanup();
```

## Known Limitations
1. Cannot access Pro-only features
2. Limited citation history
3. Search result pagination limits
4. No API access

## Error Handling
Handles Perplexity-specific issues:
- Citation extraction failures
- Search result timing
- Pagination errors
- Authentication provider issues

## Best Practices
1. Handle citations carefully
2. Process search results incrementally
3. Respect rate limits
4. Verify citation URLs
5. Monitor copilot mode changes