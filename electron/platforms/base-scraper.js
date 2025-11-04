const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs').promises;

class BasePlatformScraper {
    constructor(platformId, config) {
        this.platformId = platformId;
        this.config = config;
        this.browser = null;
        this.page = null;
        this.isAuthenticated = false;
    }

    async initialize() {
        try {
            this.browser = await chromium.launch({
                headless: false,
                viewport: { width: 1280, height: 800 }
            });
            this.page = await this.browser.newPage();
            
            // Setup error handling
            this.page.on('error', error => {
                console.error(`Page error: ${error.message}`);
            });
            
            // Handle navigation timeouts
            this.page.setDefaultTimeout(30000);
            
            return true;
        } catch (error) {
            console.error(`Failed to initialize browser: ${error.message}`);
            return false;
        }
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

            // Wait for manual login
            console.log(`Please login to ${this.config.name}...`);
            await this.page.waitForSelector(
                this.config.waitForAuthentication.selector,
                { timeout: this.config.waitForAuthentication.timeout }
            );
            
            this.isAuthenticated = true;
            return true;
        } catch (error) {
            console.error(`Authentication failed: ${error.message}`);
            return false;
        }
    }

    async checkAuthentication() {
        try {
            // Try to find the conversation list selector
            const conversationList = await this.page.$(this.config.selectors.conversationList);
            return !!conversationList;
        } catch {
            return false;
        }
    }

    async getConversations() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated');
        }

        const conversations = [];
        try {
            // Wait for conversation list
            await this.page.waitForSelector(this.config.selectors.conversationList);
            
            // Get all conversation items
            const items = await this.page.$$(this.config.selectors.conversationItem);
            
            for (const item of items) {
                try {
                    // Click the conversation to load it
                    await item.click();
                    await this.page.waitForSelector(this.config.selectors.messageList);
                    
                    // Get conversation details
                    const title = await this.getConversationTitle();
                    const messages = await this.getConversationMessages();
                    
                    conversations.push({
                        id: await item.getAttribute('id') || `${this.platformId}_${Date.now()}`,
                        title,
                        messages,
                        platform: this.platformId,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Add delay between conversations
                    await this.page.waitForTimeout(1000);
                } catch (error) {
                    console.error(`Failed to process conversation: ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`Failed to get conversations: ${error.message}`);
        }
        
        return conversations;
    }

    async getConversationTitle() {
        try {
            const titleElement = await this.page.$(this.config.selectors.conversationTitle);
            return titleElement ? await titleElement.textContent() : 'Untitled Conversation';
        } catch {
            return 'Untitled Conversation';
        }
    }

    async getConversationMessages() {
        const messages = [];
        try {
            // Get all user messages
            const userMessages = await this.page.$$(this.config.selectors.userMessage);
            for (const msg of userMessages) {
                const content = await msg.textContent();
                messages.push({ role: 'user', content });
            }
            
            // Get all assistant messages
            const assistantMessages = await this.page.$$(this.config.selectors.assistantMessage);
            for (const msg of assistantMessages) {
                const content = await msg.textContent();
                messages.push({ role: 'assistant', content });
            }
            
            // Sort messages by their position in the DOM
            messages.sort((a, b) => a.index - b.index);
        } catch (error) {
            console.error(`Failed to get messages: ${error.message}`);
        }
        
        return messages;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = { BasePlatformScraper };