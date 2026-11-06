/**
 * The Secret Word - Minimal Node.js Server
 * Zero dependencies. Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'data', 'game_data.json');

let gameData = { categories: {}, words: [] };
try {
  gameData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch (e) {
  console.error('Error reading game data:', e);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/api/combo') {
    const cat = query.category || 'all';
    const lvl = query.level || 'all';
    let pool = [];
    const categories = gameData.categories || {};
    const targetCats = (cat === 'all')
      ? Object.values(categories)
      : [categories[cat]].filter(Boolean);

    targetCats.forEach(c => {
      if (!c.levels) return;
      if (lvl === 'all') {
        Object.values(c.levels).forEach(lvlList => {
          if (Array.isArray(lvlList)) pool = pool.concat(lvlList);
        });
      } else if (c.levels[lvl]) {
        pool = pool.concat(c.levels[lvl]);
      }
    });

    if (pool.length === 0) {
      pool = [{
        topic: "Why cereal is technically a cold soup",
        relatedWords: ["chemistry", "recipe", "liquid", "chef"]
      }];
    }

    const topicItem = pool[Math.floor(Math.random() * pool.length)];
    const topic = topicItem.topic;
    const candidates = (topicItem.relatedWords && topicItem.relatedWords.length > 0)
      ? topicItem.relatedWords
      : (gameData.words || ["SECRET"]);
    const word = candidates[Math.floor(Math.random() * candidates.length)];

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: true,
      data: {
        topic,
        word: word.toUpperCase(),
        category: cat,
        rules: `Speak on "${topic}" and repeat "${word.toUpperCase()}" at least 3 times!`
      },
      timestamp: new Date().toISOString()
    }));
  }

  if (pathname === '/' || pathname === '') pathname = '/index.html';
  if (pathname === '/doc' || pathname === '/doc/') pathname = '/doc.html';

  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  }[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Not Found' }));
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`The Secret Word Game is running on http://localhost:${PORT}`);
});
