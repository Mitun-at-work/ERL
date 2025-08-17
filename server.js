require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const MUSIC_DIR = path.resolve(process.env.MUSIC_DIR || path.join(__dirname, "music"));

let db;

// Open sqlite and create unified 'songs' table
(async () => {
  db = await open({
    filename: "./music.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT UNIQUE NOT NULL,
      liked BOOLEAN DEFAULT 0,
      listen_count INTEGER DEFAULT 0
    );
  `);

  console.log("✅ Database and 'songs' table ready");
})();

// List albums (directories under MUSIC_DIR)
app.get("/albums", (req, res) => {
  const albums = fs.readdirSync(MUSIC_DIR).filter((f) =>
    fs.statSync(path.join(MUSIC_DIR, f)).isDirectory()
  );
  res.json(albums);
});

// List songs inside an album (audio files in directory)
app.get("/albums/:album", (req, res) => {
  const albumPath = path.join(MUSIC_DIR, req.params.album);
  if (!fs.existsSync(albumPath)) return res.json([]);
  const songs = fs
    .readdirSync(albumPath)
    .filter((f) => f.match(/\.(mp3|wav|ogg)$/i));
  res.json(songs);
});

// Serve static music files
app.use("/music", express.static(MUSIC_DIR));

// Record a listen: insert song if needed and increment listen_count
app.post("/listen", async (req, res) => {
  const { track } = req.body;
  if (!track) return res.status(400).json({ error: "track required" });

  await db.run("INSERT OR IGNORE INTO songs (file_path) VALUES (?)", [track]);
  await db.run("UPDATE songs SET listen_count = listen_count + 1 WHERE file_path = ?", [track]);

  res.json({ ok: true });
});

// Get listen counts for all songs ordered by listen_count desc
app.get("/listens", async (req, res) => {
  const rows = await db.all(`
    SELECT file_path, listen_count
    FROM songs
    ORDER BY listen_count DESC
  `);
  res.json(rows);
});

// Like a track: insert if needed and set liked = 1
app.post("/like", async (req, res) => {
  const { track } = req.body;
  if (!track) return res.status(400).json({ error: "track required" });

  await db.run("INSERT OR IGNORE INTO songs (file_path) VALUES (?)", [track]);
  await db.run("UPDATE songs SET liked = 1 WHERE file_path = ?", [track]);

  res.json({ ok: true });
});

// Get all liked tracks ordered by id desc (most recently added liked first)
app.get("/likes", async (req, res) => {
  const rows = await db.all(`
    SELECT file_path
    FROM songs
    WHERE liked = 1
    ORDER BY id DESC
  `);
  res.json(rows);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
