import { NextResponse } from 'next/server';
import gameData from './data/game_data.json';

interface TopicItem {
  topic: string;
  relatedWords?: string[];
}

interface CategoryObj {
  id?: string;
  name?: string;
  levels?: Record<string, TopicItem[]>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const level = searchParams.get('level') || 'all';

  let topicPool: TopicItem[] = [];
  const categories = (gameData.categories || {}) as Record<string, CategoryObj>;
  const targetCats: CategoryObj[] = (category === 'all')
    ? Object.values(categories)
    : [categories[category]].filter(Boolean);

  targetCats.forEach((c) => {
    if (!c.levels) return;
    if (level === 'all') {
      Object.values(c.levels).forEach((lvlList) => {
        if (Array.isArray(lvlList)) topicPool = topicPool.concat(lvlList);
      });
    } else if (c.levels[level]) {
      topicPool = topicPool.concat(c.levels[level]);
    }
  });

  if (topicPool.length === 0) {
    Object.values(categories).forEach((c) => {
      if (c && c.levels) {
        Object.values(c.levels).forEach((lvlList) => {
          if (Array.isArray(lvlList)) topicPool = topicPool.concat(lvlList);
        });
      }
    });
  }

  const topicItem = topicPool[Math.floor(Math.random() * topicPool.length)];
  const topic = topicItem.topic;
  const candidates = (topicItem.relatedWords && topicItem.relatedWords.length > 0)
    ? topicItem.relatedWords
    : (gameData.words || ['SECRET']);
  const word = candidates[Math.floor(Math.random() * candidates.length)];

  return NextResponse.json(
    {
      success: true,
      data: {
        topic,
        word: word.toUpperCase(),
        category,
        level,
        rules: `Speak on "${topic}" and secretly repeat the word "${word.toUpperCase()}" at least 3 times. Audience must guess the word!`,
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    }
  );
}
