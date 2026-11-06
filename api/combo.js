// Vercel Serverless Function: GET /api/combo
const gameData = require('../data/game_data.json');

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { category = 'all', level = 'all' } = req.query;

  // Collect candidate topics from single game_data.json
  let topicPool = [];
  const categories = gameData.categories || {};
  const targetCats = (category === 'all')
    ? Object.values(categories)
    : [categories[category]].filter(Boolean);

  targetCats.forEach(c => {
    if (!c.levels) return;
    if (level === 'all') {
      Object.values(c.levels).forEach(lvlList => {
        if (Array.isArray(lvlList)) topicPool = topicPool.concat(lvlList);
      });
    } else if (c.levels[level]) {
      topicPool = topicPool.concat(c.levels[level]);
    }
  });

  if (topicPool.length === 0) {
    topicPool = [
      {
        topic: "Why cereal is technically a cold soup",
        relatedWords: ["chemistry", "recipe", "liquid", "chef", "tradition", "temperature"]
      }
    ];
  }

  const topicItem = topicPool[Math.floor(Math.random() * topicPool.length)];
  const topic = topicItem.topic;
  const candidates = (topicItem.relatedWords && topicItem.relatedWords.length > 0)
    ? topicItem.relatedWords
    : (gameData.words || ["SECRET"]);
  const word = candidates[Math.floor(Math.random() * candidates.length)];

  res.status(200).json({
    success: true,
    data: {
      topic,
      word: word.toUpperCase(),
      category,
      level,
      rules: `Speak on "${topic}" and secretly repeat the word "${word.toUpperCase()}" at least 3 times. Audience must guess the word!`
    },
    timestamp: new Date().toISOString()
  });
}

