const { BasePlatformScraper } = require('./base-scraper');
const platformConfig = require('./platform-config.json');

class PerplexityScraper extends BasePlatformScraper {
    constructor() {
        super('perplexity', platformConfig.perplexity);
    }

    async authenticate() {
        try {
            await this.page.goto(this.config.baseUrl);
            
            // Check if already authenticated
            const isLoggedIn = await this.checkAuthentication();
            if (isLoggedIn) {
                this.isAuthenticated = true;
                return true;
            }

            // Perplexity uses multiple auth providers
            console.log('Please select an authentication provider and complete login...');
            await this.page.waitForSelector(
                this.config.waitForAuthentication.selector,
                { timeout: this.config.waitForAuthentication.timeout }
            );
            
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error(`Perplexity authentication failed: ${error.message}`);
            return false;
        }
    }

    async getConversations() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated');
        }

        const conversations = [];
        try {
            // Perplexity loads conversations dynamically
            await this.page.waitForSelector(this.config.selectors.conversationList);
            await this.loadAllConversations();
            
            const items = await this.page.$$(this.config.selectors.conversationItem);
            
            for (const item of items) {
                try {
                    await item.click();
                    await this.page.waitForSelector(this.config.selectors.messageList);
                    
                    const title = await this.getConversationTitle();
                    const messages = await this.getConversationMessages();
                    const metadata = await this.getPerplexityMetadata();
                    
                    conversations.push({
                        id: await item.getAttribute('data-conversation-id') || `perplexity_${Date.now()}`,
                        title,
                        messages,
                        platform: this.platformId,
                        timestamp: new Date().toISOString(),
                        metadata
                    });
                    
                    await this.page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Failed to process Perplexity conversation: ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`Failed to get Perplexity conversations: ${error.message}`);
        }
        
        return conversations;
    }

    async loadAllConversations() {
        // Perplexity uses a "Load More" button
        while (true) {
            try {
                const loadMoreButton = await this.page.$('button[data-load-more]');
                if (!loadMoreButton) break;
                
                await loadMoreButton.click();
                await this.page.waitForTimeout(1000);
            } catch {
                break;
            }
        }
    }

    async getConversationMessages() {
        const messages = [];
        try {
            const messageElements = await this.page.$$(
                `${this.config.selectors.userMessage}, ${this.config.selectors.assistantMessage}`
            );

            for (const msg of messageElements) {
                const role = await msg.getAttribute('role');
                const content = await this.extractMessageContent(msg);
                
                messages.push({
                    role: role === 'user-query' ? 'user' : 'assistant',
                    content,
                    timestamp: await this.getMessageTimestamp(msg)
                });
            }
        } catch (error) {
            console.error(`Failed to get Perplexity messages: ${error.message}`);
        }
        
        return messages;
    }

    async extractMessageContent(messageElement) {
        try {
            const content = {
                text: await messageElement.$eval('[data-content]', el => el.textContent),
                citations: [],
                codeBlocks: []
            };

            // Extract citations (unique to Perplexity)
            const citations = await messageElement.$$('[data-citation]');
            content.citations = await Promise.all(citations.map(async citation => ({
                text: await citation.$eval('[data-citation-text]', el => el.textContent),
                url: await citation.getAttribute('data-citation-url'),
                title: await citation.getAttribute('data-citation-title')
            })));

            // Extract code blocks
            const codeBlocks = await messageElement.$$('pre[class*="code"]');
            content.codeBlocks = await Promise.all(codeBlocks.map(async block => {
                const language = await block.getAttribute('data-language') || '';
                const code = await block.$eval('code', el => el.textContent);
                return { language, code };
            }));

            return content;
        } catch (error) {
            console.error(`Failed to extract Perplexity message content: ${error.message}`);
            return { text: 'Failed to extract content' };
        }
    }

    async getMessageTimestamp(messageElement) {
        try {
            return await messageElement.getAttribute('data-timestamp');
        } catch {
            return new Date().toISOString();
        }
    }

    async getPerplexityMetadata() {
        try {
            return {
                model: await this.page.$eval('[data-model-name]', el => el.textContent),
                copilotMode: await this.page.$eval('[data-copilot-mode]', el => el.textContent),
                searchResults: await this.getSearchResults()
            };
        } catch {
            return {};
        }
    }

    async getSearchResults() {
        // Perplexity shows search results for each query
        try {
            const results = await this.page.$$('[data-search-result]');
            return await Promise.all(results.map(async result => ({
                title: await result.$eval('[data-result-title]', el => el.textContent),
                url: await result.$eval('[data-result-url]', el => el.getAttribute('href')),
                snippet: await result.$eval('[data-result-snippet]', el => el.textContent)
            })));
        } catch {
            return [];
        }
    }
}

module.exports = { PerplexityScraper };