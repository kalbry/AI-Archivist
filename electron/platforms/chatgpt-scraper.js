const { BasePlatformScraper } = require('./base-scraper');
const platformConfig = require('./platform-config.json');

class ChatGPTScraper extends BasePlatformScraper {
    constructor() {
        super('chatgpt', platformConfig.chatgpt);
    }

    async getConversationMessages() {
        const messages = [];
        try {
            // ChatGPT specific: Messages are in thread format
            const thread = await this.page.$(this.config.selectors.messageList);
            const messageElements = await thread.$$('div[class*="group"]');

            for (const msg of messageElements) {
                const isUser = await msg.getAttribute('data-testid') === 'user-message';
                const content = await msg.textContent();
                
                // Get timestamp if available
                let timestamp;
                try {
                    const timeElement = await msg.$('time');
                    if (timeElement) {
                        timestamp = await timeElement.getAttribute('datetime');
                    }
                } catch (e) {
                    // Timestamp not available
                }

                messages.push({
                    role: isUser ? 'user' : 'assistant',
                    content: content.trim(),
                    timestamp
                });
            }
        } catch (error) {
            console.error(`Failed to get ChatGPT messages: ${error.message}`);
        }
        
        return messages;
    }

    // ChatGPT specific handling for code blocks
    async processCodeBlocks(content) {
        const codeBlocks = await this.page.$$('pre[class*="code"]');
        const processedBlocks = [];

        for (const block of codeBlocks) {
            try {
                const language = await block.$eval('span[class*="lang"]', el => el.textContent);
                const code = await block.$eval('code', el => el.textContent);
                processedBlocks.push({ language, code });
            } catch (e) {
                console.warn('Failed to process code block:', e);
            }
        }

        return processedBlocks;
    }
}

module.exports = { ChatGPTScraper };