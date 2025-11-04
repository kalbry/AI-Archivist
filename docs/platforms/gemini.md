# Gemini Scraper Documentation

## Overview
The Gemini scraper handles conversation extraction from gemini.google.com, including support for Google authentication and image input processing.

## Features
- Google authentication integration
- Image input support
- Infinite scroll handling
- Safety settings capture
- Code block extraction

## Implementation Details

### Authentication
```javascript
await this.page.goto('https://gemini.google.com');
await this.page.waitForSelector('div[data-id="chat-list"]');
```
Uses Google's OAuth flow. Waits for the chat list to confirm successful authentication.

### Conversation Structure
Conversations include:
- Unique Google-assigned ID
- Title
- Messages with text and images
- Timestamps
- Safety settings
- Model metadata

### Image Processing
Handles Gemini's image capabilities:
```javascript
const images = await messageElement.$$('img[data-type="user-input"]');
const imageUrls = await Promise.all(images.map(img => 
    img.getAttribute('src')
));
```

### Pagination Handling
Implements infinite scroll:
```javascript
async scrollToLoadAllConversations() {
    let previousHeight = 0;
    let currentHeight = await this.page.evaluate(() => document.body.scrollHeight);
    
    while (previousHeight !== currentHeight) {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(2000);
        previousHeight = currentHeight;
        currentHeight = await this.page.evaluate(() => document.body.scrollHeight);
    }
}
```

## Usage Example
```javascript
const scraper = new GeminiScraper();
await scraper.initialize();
await scraper.authenticate(); // Requires Google login
const conversations = await scraper.getConversations();
await scraper.cleanup();
```

## Known Limitations
1. Cannot access API-only features
2. Image resolution limitations
3. No support for enterprise features
4. Region-specific content restrictions

## Error Handling
Handles Gemini-specific cases:
- Google authentication errors
- Image loading failures
- Scroll pagination issues
- Safety filter blocks

## Best Practices
1. Handle image content carefully
2. Implement scroll pagination properly
3. Respect safety settings
4. Monitor Google auth status
5. Handle rate limits appropriately