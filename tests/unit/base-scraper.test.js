const { expect, test, beforeAll, afterAll, jest } = require('@jest/globals');
const { BasePlatformScraper } = require('../../electron/platforms/base-scraper');

// Mock platform config for testing
const mockConfig = {
    name: "Test Platform",
    baseUrl: "https://test.example.com",
    selectors: {
        loginButton: "#login",
        conversationList: "#conversations",
        conversationItem: ".conversation",
        messageList: "#messages",
        userMessage: ".user-message",
        assistantMessage: ".assistant-message"
    },
    waitForAuthentication: {
        selector: "#conversations",
        timeout: 5000
    }
};

// Mock Playwright's Page and Browser
const mockPage = {
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    $: jest.fn(),
    $$: jest.fn(),
    setDefaultTimeout: jest.fn(),
    on: jest.fn()
};

const mockBrowser = {
    newPage: jest.fn(() => Promise.resolve(mockPage)),
    close: jest.fn()
};

// Mock Playwright
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn(() => Promise.resolve(mockBrowser))
    }
}));

describe('BasePlatformScraper', () => {
    let scraper;

    beforeAll(() => {
        scraper = new BasePlatformScraper('test-platform', mockConfig);
    });

    afterAll(async () => {
        await scraper.cleanup();
    });

    test('initialize() sets up browser and page', async () => {
        const result = await scraper.initialize();
        expect(result).toBe(true);
        expect(scraper.page).toBeDefined();
        expect(scraper.browser).toBeDefined();
    });

    test('authenticate() handles successful login', async () => {
        mockPage.waitForSelector.mockResolvedValueOnce(true);
        const result = await scraper.authenticate();
        expect(result).toBe(true);
        expect(scraper.isAuthenticated).toBe(true);
    });

    test('authenticate() handles failed login', async () => {
        mockPage.waitForSelector.mockRejectedValueOnce(new Error('Timeout'));
        const result = await scraper.authenticate();
        expect(result).toBe(false);
        expect(scraper.isAuthenticated).toBe(false);
    });

    test('checkAuthentication() detects logged in state', async () => {
        mockPage.$.mockResolvedValueOnce(true);
        const result = await scraper.checkAuthentication();
        expect(result).toBe(true);
    });

    test('getConversations() requires authentication', async () => {
        scraper.isAuthenticated = false;
        await expect(scraper.getConversations()).rejects.toThrow('Not authenticated');
    });

    test('cleanup() closes browser', async () => {
        await scraper.cleanup();
        expect(mockBrowser.close).toHaveBeenCalled();
    });
});