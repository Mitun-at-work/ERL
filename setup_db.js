const Database = require('better-sqlite3');
const db = new Database('music.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    liked BOOLEAN DEFAULT 0,
    listen_count INTEGER DEFAULT 0
  )
`).run();

console.log("Songs table created or already exists.");
