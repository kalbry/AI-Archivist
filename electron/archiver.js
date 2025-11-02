const fs = require('fs').promises;
const path = require('path');
const JSZip = require('jszip');
const { initDatabase } = require('./database');
const { Scraper } = require('./scraper');

const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

// This is the core backend logic
async function runArchiveJob({ platforms, formats, webContents }) {
  const db = initDatabase();
  const outputDir = path.join(process.cwd(), 'AI_Archivist_Exports', `run_${Date.now()}`);
  
  const sendLog = (level, message, platformId) => {
    const logEntry = { timestamp: new Date(), level, message, platformId };
    webContents.send('log-entry', logEntry);
  };
  
  const sendProgress = (platformId, percent, message) => {
    webContents.send('progress-update', { platformId, percent, message });
  };
  
  const sendCompletion = (status) => {
    webContents.send('job-completion', { status });
  };
  
  try {
    await fs.mkdir(outputDir, { recursive: true });
    sendLog(LOG_LEVEL.INFO, `Starting archive run. Output directory: ${outputDir}`);
  } catch (e) {
    sendLog(LOG_LEVEL.ERROR, `Failed to create output directory: ${e.message}`);
    sendCompletion('Failed');
    return;
  }

  let hasError = false;

  for (const platform of platforms) {
    const platformDir = path.join(outputDir, platform.name);
    try {
      await fs.mkdir(platformDir, { recursive: true });
      sendLog(LOG_LEVEL.INFO, `Connecting to ${platform.name}...`, platform.name);
      sendProgress(platform.id, 10, 'Connecting...');

      // --- This is where you would use the real scraper ---
      // const scraper = new Scraper(platform.id);
      // await scraper.launch();
      // const conversations = await scraper.scrapeConversations();
      // await scraper.close();
      
      // --- Faking scraper results for demonstration ---
      await new Promise(res => setTimeout(res, 1500));
      const conversations = Array.from({ length: platform.conversationCount }, (_, i) => ({
          id: `${platform.id}_conv_${i}`,
          title: `Conversation ${i + 1}`,
          messages: [{ role: 'user', content: `Hello ${i}`}, {role: 'assistant', content: `Hi there!`}]
      }));
      // --- End of fake data ---

      sendLog(LOG_LEVEL.INFO, `Found ${conversations.length} conversations. Processing...`, platform.name);
      sendProgress(platform.id, 30, `Processing ${conversations.length} items`);

      const insertConvStmt = db.prepare('INSERT OR REPLACE INTO conversations (id, platform, title) VALUES (?, ?, ?)');
      const insertMsgStmt = db.prepare('INSERT OR REPLACE INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)');

      for (let i = 0; i < conversations.length; i++) {
        const conv = conversations[i];
        
        // Write to database
        insertConvStmt.run(conv.id, platform.id, conv.title);
        conv.messages.forEach((msg, j) => {
            insertMsgStmt.run(`${conv.id}_msg_${j}`, conv.id, msg.role, msg.content);
        });

        // Write to files (if format is selected)
        if (formats.includes('Markdown (.md)')) {
            const mdContent = `# ${conv.title}\n\n` + conv.messages.map(m => `**${m.role}**: ${m.content}`).join('\n\n---\n\n');
            const safeTitle = conv.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await fs.writeFile(path.join(platformDir, `${safeTitle}.md`), mdContent);
        }

        const percent = 30 + (i / conversations.length) * 60;
        sendProgress(platform.id, percent, `Processing ${i + 1}/${conversations.length}`);
      }
      
      sendLog(LOG_LEVEL.SUCCESS, `Successfully archived ${platform.name}.`, platform.name);
      sendProgress(platform.id, 100, 'Complete');

    } catch (e) {
      hasError = true;
      sendLog(LOG_LEVEL.ERROR, `Failed to archive ${platform.name}: ${e.message}`, platform.name);
      sendProgress(platform.id, 100, 'Failed');
    }
  }

  sendLog(LOG_LEVEL.INFO, "Archive run finished processing platforms.");
  sendCompletion(hasError ? 'Failed' : 'Completed');
}

module.exports = { runArchiveJob };
