# ChatGPT Scraper Documentation

## Overview
The ChatGPT scraper is responsible for extracting conversations from chat.openai.com. It handles OpenAI's specific chat interface, including code blocks, timestamps, and thread-based conversations.

## Features
- Thread-based conversation extraction
- Code block parsing with language detection
- Timestamp tracking for messages
- Support for both GPT-3.5 and GPT-4 conversations

## Implementation Details

### Authentication
```javascript
await this.page.goto('https://chat.openai.com');
await this.page.waitForSelector('nav[data-testid="conversation-list"]');
```
ChatGPT uses a standard OAuth flow. The scraper waits for the conversation list to appear, indicating successful authentication.

### Conversation Structure
Each conversation contains:
- Unique ID
- Title
- Messages array (user/assistant)
- Timestamps
- Code blocks with language metadata

### Message Extraction
Messages are extracted from the DOM using ChatGPT-specific selectors:
```javascript
div[class*="group"]         // Message container
[data-testid="user-message"] // User messages
pre[class*="code"]         // Code blocks
```

### Code Block Processing
Code blocks are parsed with:
- Language detection from class names
- Proper indentation preservation
- Syntax highlighting metadata

## Usage Example
```javascript
const scraper = new ChatGPTScraper();
await scraper.initialize();
await scraper.authenticate();
const conversations = await scraper.getConversations();
await scraper.cleanup();
```

## Known Limitations
1. Cannot access paid API-only features
2. No support for custom instructions
3. Limited to browser-accessible content

## Error Handling
The scraper handles common errors:
- Network timeouts
- Authentication failures
- Missing elements
- Rate limiting

## Best Practices
1. Add delays between conversation fetches
2. Verify authentication status before scraping
3. Handle code blocks carefully to preserve formatting
4. Monitor for DOM structure changes