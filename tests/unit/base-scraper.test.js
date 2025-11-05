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

// Mock Playwright functionality
const mockPage = {
    goto: jest.fn().mockResolvedValue(null),
    waitForSelector: jest.fn().mockResolvedValue(true),
    $: jest.fn().mockResolvedValue({ textContent: 'Test Content' }),
    $$: jest.fn().mockResolvedValue([]),
    setDefaultTimeout: jest.fn(),
    on: jest.fn(),
    evaluate: jest.fn().mockImplementation((fn) => fn()),
    close: jest.fn().mockResolvedValue(null),
    setContent: jest.fn().mockResolvedValue(null)
};

const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn().mockResolvedValue(null),
    contexts: jest.fn().mockResolvedValue([]),
    newContext: jest.fn().mockResolvedValue({
        newPage: jest.fn().mockResolvedValue(mockPage)
    })
};

// Mock Playwright
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn().mockResolvedValue(mockBrowser),
        connectOverCDP: jest.fn().mockResolvedValue(mockBrowser)
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