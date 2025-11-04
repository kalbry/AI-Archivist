const { expect, test, beforeAll, afterAll } = require('@jest/globals');
const { ScraperFactory } = require('../../electron/scraper');
const { ChatGPTScraper } = require('../../electron/platforms/chatgpt-scraper');
const { ClaudeScraper } = require('../../electron/platforms/claude-scraper');
const { GeminiScraper } = require('../../electron/platforms/gemini-scraper');
const { PerplexityScraper } = require('../../electron/platforms/perplexity-scraper');

describe('ScraperFactory', () => {
    test('creates ChatGPT scraper', () => {
        const scraper = ScraperFactory.createScraper('chatgpt');
        expect(scraper).toBeInstanceOf(ChatGPTScraper);
    });

    test('creates Claude scraper', () => {
        const scraper = ScraperFactory.createScraper('claude');
        expect(scraper).toBeInstanceOf(ClaudeScraper);
    });

    test('creates Gemini scraper', () => {
        const scraper = ScraperFactory.createScraper('gemini');
        expect(scraper).toBeInstanceOf(GeminiScraper);
    });

    test('creates Perplexity scraper', () => {
        const scraper = ScraperFactory.createScraper('perplexity');
        expect(scraper).toBeInstanceOf(PerplexityScraper);
    });

    test('throws error for unknown platform', () => {
        expect(() => {
            ScraperFactory.createScraper('unknown');
        }).toThrow('Unsupported platform: unknown');
    });
});