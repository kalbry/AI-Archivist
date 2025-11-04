const { expect, test, beforeAll, afterAll, jest } = require('@jest/globals');
const { ChatGPTScraper } = require('../../electron/platforms/chatgpt-scraper');
const platformConfig = require('../../electron/platforms/platform-config.json');

// Mock message data
const mockMessages = [
    {
        role: 'user',
        content: 'Hello',
        timestamp: '2025-11-04T10:00:00Z'
    },
    {
        role: 'assistant',
        content: 'Hi there! How can I help you?',
        timestamp: '2025-11-04T10:00:01Z'
    },
    {
        role: 'user',
        content: '```python\nprint("Hello World")\n```',
        timestamp: '2025-11-04T10:00:02Z'
    }
];

// Mock page elements
const mockMessageElements = mockMessages.map(msg => ({
    getAttribute: jest.fn(() => msg.role === 'user' ? 'user-message' : null),
    textContent: jest.fn(() => msg.content),
    $eval: jest.fn((selector, fn) => msg.content)
}));

const mockPage = {
    goto: jest.fn(),
    waitForSelector: jest.fn(),
    $: jest.fn(),
    $$: jest.fn(() => Promise.resolve(mockMessageElements)),
    setDefaultTimeout: jest.fn(),
    on: jest.fn()
};

// Mock browser
const mockBrowser = {
    newPage: jest.fn(() => Promise.resolve(mockPage)),
    close: jest.fn()
};

jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn(() => Promise.resolve(mockBrowser))
    }
}));

describe('ChatGPTScraper', () => {
    let scraper;

    beforeAll(() => {
        scraper = new ChatGPTScraper();
    });

    afterAll(async () => {
        await scraper.cleanup();
    });

    test('processes code blocks correctly', async () => {
        const codeBlock = mockMessages[2].content;
        const processedBlock = await scraper.processCodeBlocks(codeBlock);
        expect(processedBlock).toContainEqual({
            language: 'python',
            code: 'print("Hello World")'
        });
    });

    test('extracts conversation messages with correct format', async () => {
        mockPage.waitForSelector.mockResolvedValue(true);
        const messages = await scraper.getConversationMessages();
        
        expect(messages.length).toBe(mockMessages.length);
        expect(messages[0].role).toBe('user');
        expect(messages[1].role).toBe('assistant');
    });

    test('handles conversation metadata', async () => {
        const mockTitle = 'Test Conversation';
        mockPage.$.mockImplementation(() => ({
            textContent: () => mockTitle
        }));

        const title = await scraper.getConversationTitle();
        expect(title).toBe(mockTitle);
    });

    test('handles authentication flow', async () => {
        mockPage.waitForSelector.mockResolvedValueOnce(true);
        const result = await scraper.authenticate();
        expect(result).toBe(true);
        expect(scraper.isAuthenticated).toBe(true);
    });
});