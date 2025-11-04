const { BasePlatformScraper } = require('./base-scraper');
const platformConfig = require('./platform-config.json');

class ClaudeScraper extends BasePlatformScraper {
    constructor() {
        super('claude', platformConfig.claude);
    }

    async getConversations() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated');
        }

        const conversations = [];
        try {
            // Claude specific: Need to wait for the conversation list to fully load
            await this.page.waitForSelector(this.config.selectors.conversationList);
            await this.page.waitForTimeout(2000); // Wait for dynamic loading
            
            const items = await this.page.$$(this.config.selectors.conversationItem);
            
            for (const item of items) {
                try {
                    // Claude loads conversations in a side panel
                    await item.click();
                    await this.page.waitForSelector(this.config.selectors.messageList);
                    await this.page.waitForTimeout(1500); // Wait for messages to load
                    
                    const title = await this.getConversationTitle();
                    const messages = await this.getConversationMessages();
                    
                    // Get Claude-specific metadata
                    const metadata = await this.getClaudeMetadata();
                    
                    conversations.push({
                        id: await item.getAttribute('data-conversation-id') || `claude_${Date.now()}`,
                        title,
                        messages,
                        platform: this.platformId,
                        timestamp: new Date().toISOString(),
                        metadata
                    });
                    
                    await this.page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Failed to process Claude conversation: ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`Failed to get Claude conversations: ${error.message}`);
        }
        
        return conversations;
    }

    async getConversationMessages() {
        const messages = [];
        try {
            const messageContainer = await this.page.$(this.config.selectors.messageList);
            const messageElements = await messageContainer.$$('[data-message]');

            for (const msg of messageElements) {
                const role = await msg.getAttribute('data-message-role');
                const content = await msg.$eval('[data-message-content]', el => el.innerHTML);
                
                // Process Claude's markdown content
                const processedContent = await this.processClaudeContent(content);
                
                messages.push({
                    role: role === 'human' ? 'user' : 'assistant',
                    content: processedContent,
                    timestamp: await msg.getAttribute('data-message-timestamp')
                });
            }
        } catch (error) {
            console.error(`Failed to get Claude messages: ${error.message}`);
        }
        
        return messages;
    }

    async processClaudeContent(content) {
        // Claude uses a mix of HTML and Markdown
        // Remove unnecessary HTML but preserve code blocks and formatting
        content = content.replace(/<p>/g, '\\n').replace(/<\/p>/g, '')
                        .replace(/<br\/?>/g, '\\n')
                        .replace(/<code class="language-([^"]+)">/g, '```$1\\n')
                        .replace(/<\/code>/g, '\\n```');
        
        // Clean up any remaining HTML tags
        content = content.replace(/<[^>]+>/g, '');
        
        return content.trim();
    }

    async getClaudeMetadata() {
        try {
            const metadata = {
                model: await this.page.$eval('[data-model-info]', el => el.textContent),
                temperature: await this.page.$eval('[data-temperature]', el => el.textContent),
                maxTokens: await this.page.$eval('[data-max-tokens]', el => el.textContent)
            };
            return metadata;
        } catch {
            return {};
        }
    }
}

module.exports = { ClaudeScraper };