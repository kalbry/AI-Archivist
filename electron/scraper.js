const { ChatGPTScraper } = require('./platforms/chatgpt-scraper');
const { ClaudeScraper } = require('./platforms/claude-scraper');
const { GeminiScraper } = require('./platforms/gemini-scraper');
const { PerplexityScraper } = require('./platforms/perplexity-scraper');
const platformConfig = require('./platforms/platform-config.json');

class ScraperFactory {
    static createScraper(platformId) {
        switch (platformId) {
            case 'chatgpt':
                return new ChatGPTScraper();
            case 'claude':
                return new ClaudeScraper();
            case 'gemini':
                return new GeminiScraper();
            case 'perplexity':
                return new PerplexityScraper();
            default:
                throw new Error(`Unsupported platform: ${platformId}`);
        }
    }
}

class Scraper {
    constructor(platformId) {
        this.scraper = ScraperFactory.createScraper(platformId);
    }

    async launch() {
        await this.scraper.initialize();
    }

    async login() {
        await this.scraper.authenticate();
    }

    async scrapeConversations() {
        return await this.scraper.getConversations();
    }

    async close() {
        await this.scraper.cleanup();
    }
}

module.exports = { Scraper };
