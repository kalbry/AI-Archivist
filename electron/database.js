const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'archive.db');
let db;

function initDatabase() {
    if (db) return db;

    db = new Database(dbPath, { verbose: console.log });
    console.log('Database connected at', dbPath);

    // Create tables if they don't exist
    const schema = `
    CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        title TEXT,
        created_at TEXT,
        updated_at TEXT,
        source_url TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT,
        content TEXT,
        created_at TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
    );

    CREATE TABLE IF NOT EXISTS attachments (
        id TEXT PRIMARY KEY,
        message_id TEXT NOT NULL,
        type TEXT,
        mime TEXT,
        size INTEGER,
        local_path TEXT,
        source_url TEXT,
        sha256 TEXT,
        FOREIGN KEY (message_id) REFERENCES messages (id)
    );
    `;

    db.exec(schema);
    console.log('Database schema ensured.');
    return db;
}

module.exports = { initDatabase };
