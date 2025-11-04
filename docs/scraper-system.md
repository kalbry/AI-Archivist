# AI Archivist Scraper System

## Overview
The AI Archivist scraping system is built on a modular architecture that enables consistent conversation extraction across multiple AI platforms while handling platform-specific features and requirements.

## Architecture

### Base Scraper
The `BasePlatformScraper` class provides common functionality:
- Browser initialization
- Authentication management
- Conversation navigation
- Error handling
- Resource cleanup

### Platform-Specific Scrapers
Each platform has a dedicated scraper that extends the base functionality:
- [ChatGPT](./platforms/chatgpt.md) - OpenAI's chat interface
- [Claude](./platforms/claude.md) - Anthropic's assistant
- [Gemini](./platforms/gemini.md) - Google's AI platform
- [Perplexity](./platforms/perplexity.md) - Research-focused AI

### Factory Pattern
The `ScraperFactory` instantiates appropriate scrapers:
```javascript
class ScraperFactory {
    static createScraper(platformId) {
        switch (platformId) {
            case 'chatgpt': return new ChatGPTScraper();
            case 'claude': return new ClaudeScraper();
            case 'gemini': return new GeminiScraper();
            case 'perplexity': return new PerplexityScraper();
        }
    }
}
```

## Common Patterns

### Authentication Flow
1. Navigate to platform URL
2. Check for existing session
3. Wait for manual authentication if needed
4. Verify successful login

### Conversation Extraction
1. Load conversation list
2. Handle pagination
3. Process each conversation:
   - Extract metadata
   - Capture messages
   - Process special content (code, images)
   - Record timestamps

### Error Handling
- Authentication failures
- Network issues
- Rate limiting
- DOM changes
- Content processing errors

## Best Practices

### Performance
1. Use appropriate delays between actions
2. Implement efficient pagination
3. Batch process conversations
4. Clean up resources properly

### Reliability
1. Verify selectors before use
2. Handle timeout scenarios
3. Implement retry logic
4. Validate extracted content

### Maintenance
1. Monitor for UI changes
2. Update selectors promptly
3. Document platform updates
4. Test regularly

## Adding New Platforms

1. Create platform configuration in `platform-config.json`
2. Implement platform-specific scraper class
3. Add to `ScraperFactory`
4. Create platform documentation
5. Add test cases

## Configuration

Platform configurations are maintained in `platform-config.json`:
```json
{
  "platformId": {
    "name": "Platform Name",
    "baseUrl": "https://platform.example.com",
    "selectors": {
      "loginButton": "selector",
      "conversationList": "selector",
      ...
    },
    "waitForAuthentication": {
      "selector": "selector",
      "timeout": 300000
    }
  }
}
```