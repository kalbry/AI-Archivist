# Claude Scraper Documentation

## Overview
The Claude scraper extracts conversations from claude.ai, handling Anthropic's unique HTML/Markdown hybrid format and capturing detailed model metadata.

## Features
- Mixed HTML/Markdown content processing
- Model metadata extraction
- Temperature and token settings capture
- Rich text formatting preservation

## Implementation Details

### Authentication
```javascript
await this.page.goto('https://claude.ai');
await this.page.waitForSelector('div[data-testid="conversation-list"]');
```
Claude uses a custom authentication flow. The scraper waits for the conversation list to indicate successful login.

### Conversation Structure
Each conversation includes:
- Unique conversation ID
- Title
- Message array
- Timestamps
- Model metadata (temperature, max tokens)
- HTML-processed content

### Message Processing
Claude's messages require special processing:
```javascript
content = content.replace(/<p>/g, '\n')
                .replace(/<\/p>/g, '')
                .replace(/<br\/?>/g, '\n')
                .replace(/<code class="language-([^"]+)">/g, '```$1\n');
```

### Metadata Extraction
Captures Claude-specific settings:
- Model version
- Temperature
- Maximum tokens
- Other conversation parameters

## Usage Example
```javascript
const scraper = new ClaudeScraper();
await scraper.initialize();
await scraper.authenticate();
const conversations = await scraper.getConversations();
await scraper.cleanup();
```

## Known Limitations
1. Cannot access organization-specific features
2. Limited to browser-accessible conversations
3. No support for file uploads

## Error Handling
Handles Claude-specific issues:
- Session timeouts
- Rate limiting
- Content processing errors
- Authentication failures

## Best Practices
1. Process HTML content carefully
2. Preserve markdown formatting
3. Handle model metadata consistently
4. Monitor for UI changes
5. Respect rate limits