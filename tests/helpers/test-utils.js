const { jest } = require('@jest/globals');

// Create reusable mock objects for Playwright
const createPlaywrightMocks = () => {
    const mockPage = {
        goto: jest.fn().mockResolvedValue(null),
        waitForSelector: jest.fn().mockResolvedValue(true),
        $: jest.fn().mockResolvedValue({ textContent: 'Test Content' }),
        $$: jest.fn().mockResolvedValue([]),
        setDefaultTimeout: jest.fn(),
        on: jest.fn(),
        evaluate: jest.fn().mockImplementation((fn) => fn()),
        close: jest.fn().mockResolvedValue(null),
        setContent: jest.fn().mockResolvedValue(null),
        locator: jest.fn().mockReturnValue({
            innerText: jest.fn().mockResolvedValue('Test Text'),
            count: jest.fn().mockResolvedValue(1),
            all: jest.fn().mockResolvedValue([])
        })
    };

    const mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(null),
        contexts: jest.fn().mockResolvedValue([]),
        newContext: jest.fn().mockResolvedValue({
            newPage: jest.fn().mockResolvedValue(mockPage)
        })
    };

    return { mockPage, mockBrowser };
};

// Mock platform config factory
const createMockPlatformConfig = (platformName = 'test') => ({
    name: `${platformName.charAt(0).toUpperCase()}${platformName.slice(1)} Platform`,
    baseUrl: `https://${platformName}.example.com`,
    selectors: {
        loginButton: '#login',
        conversationList: '#conversations',
        conversationItem: '.conversation',
        messageList: '#messages',
        userMessage: '.user-message',
        assistantMessage: '.assistant-message'
    },
    waitForAuthentication: {
        selector: '#authenticated',
        timeout: 5000
    }
});

module.exports = {
    createPlaywrightMocks,
    createMockPlatformConfig
};