const { BasePlatformScraper } = require('./base-scraper');
const platformConfig = require('./platform-config.json');

class GeminiScraper extends BasePlatformScraper {
    constructor() {
        super('gemini', platformConfig.gemini);
    }

    async authenticate() {
        // Gemini requires Google authentication
        try {
            await this.page.goto(this.config.baseUrl);
            
            // Check if already authenticated through Google
            const isLoggedIn = await this.checkAuthentication();
            if (isLoggedIn) {
                this.isAuthenticated = true;
                return true;
            }

            // Wait for Google sign-in completion
            console.log('Please complete Google sign-in...');
            await this.page.waitForSelector(
                this.config.waitForAuthentication.selector,
                { timeout: this.config.waitForAuthentication.timeout }
            );
            
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error(`Gemini authentication failed: ${error.message}`);
            return false;
        }
    }

    async getConversations() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated');
        }

        const conversations = [];
        try {
            // Gemini has infinite scroll - need to handle pagination
            await this.scrollToLoadAllConversations();
            
            const items = await this.page.$$(this.config.selectors.conversationItem);
            
            for (const item of items) {
                try {
                    await item.click();
                    await this.page.waitForSelector(this.config.selectors.messageList);
                    await this.page.waitForTimeout(1000); // Wait for content to load
                    
                    const title = await this.getConversationTitle();
                    const messages = await this.getConversationMessages();
                    
                    // Get Gemini-specific metadata
                    const metadata = await this.getGeminiMetadata();
                    
                    conversations.push({
                        id: await item.getAttribute('data-id') || `gemini_${Date.now()}`,
                        title,
                        messages,
                        platform: this.platformId,
                        timestamp: new Date().toISOString(),
                        metadata
                    });
                } catch (error) {
                    console.error(`Failed to process Gemini conversation: ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`Failed to get Gemini conversations: ${error.message}`);
        }
        
        return conversations;
    }

    async scrollToLoadAllConversations() {
        let previousHeight = 0;
        let currentHeight = await this.page.evaluate(() => document.body.scrollHeight);
        
        while (previousHeight !== currentHeight) {
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(2000); // Wait for content to load
            
            previousHeight = currentHeight;
            currentHeight = await this.page.evaluate(() => document.body.scrollHeight);
        }
    }

    async getConversationMessages() {
        const messages = [];
        try {
            const messageElements = await this.page.$$(
                `${this.config.selectors.userMessage}, ${this.config.selectors.assistantMessage}`
            );

            for (const msg of messageElements) {
                const isUser = await msg.matches(this.config.selectors.userMessage);
                const content = await this.getMessageContent(msg);
                
                messages.push({
                    role: isUser ? 'user' : 'assistant',
                    content,
                    timestamp: await this.getMessageTimestamp(msg)
                });
            }
        } catch (error) {
            console.error(`Failed to get Gemini messages: ${error.message}`);
        }
        
        return messages;
    }

    async getMessageContent(messageElement) {
        try {
            // Handle text content
            const textContent = await messageElement.$eval('[data-content-text]', el => el.textContent);
            
            // Handle code blocks
            const codeBlocks = await messageElement.$$('pre[class*="code-block"]');
            const processedCodeBlocks = await Promise.all(codeBlocks.map(async block => {
                const language = await block.getAttribute('data-language');
                const code = await block.$eval('code', el => el.textContent);
                return `\`\`\`${language}\n${code}\n\`\`\``;
            }));
            
            // Handle images (Gemini supports image input)
            const images = await messageElement.$$('img[data-type="user-input"]');
            const imageUrls = await Promise.all(images.map(img => 
                img.getAttribute('src')
            ));
            
            return {
                text: textContent,
                codeBlocks: processedCodeBlocks,
                images: imageUrls
            };
        } catch (error) {
            console.error(`Failed to process Gemini message content: ${error.message}`);
            return { text: 'Failed to extract content' };
        }
    }

    async getMessageTimestamp(messageElement) {
        try {
            const timestamp = await messageElement.$eval(
                'time[data-timestamp]',
                el => el.getAttribute('datetime')
            );
            return timestamp;
        } catch {
            return new Date().toISOString();
        }
    }

    async getGeminiMetadata() {
        try {
            return {
                model: await this.page.$eval('[data-model-name]', el => el.textContent),
                safetySettings: await this.page.$eval('[data-safety-settings]', el => 
                    JSON.parse(el.getAttribute('data-settings'))
                )
            };
        } catch {
            return {};
        }
    }
}

module.exports = { GeminiScraper };