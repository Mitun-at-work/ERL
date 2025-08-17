const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const MUSIC_DIR = path.join(__dirname, "music");

// list albums
app.get("/albums", (req, res) => {
  const albums = fs.readdirSync(MUSIC_DIR).filter(f =>
    fs.statSync(path.join(MUSIC_DIR, f)).isDirectory()
  );
  res.json(albums);
});

// list songs inside album
app.get("/albums/:album", (req, res) => {
  const albumPath = path.join(MUSIC_DIR, req.params.album);
  if (!fs.existsSync(albumPath)) return res.json([]);
  const songs = fs.readdirSync(albumPath).filter(f => f.match(/\.(mp3|wav|ogg)$/i));
  res.json(songs);
});


// serve static files
app.use("/music", express.static(MUSIC_DIR));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
