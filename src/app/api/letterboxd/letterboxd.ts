import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

interface LetterboxdFilm {
  title: string;
  link: string;
  pubDate: string;
  watchedDate: string;
  rewatch: string;
  filmTitle: string;
  filmYear: string;
  memberRating: string;
  description: string;
  imageUrl: string | undefined;
  creator: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache: { [key: string]: { data: LetterboxdFilm[]; timestamp: number } } = {};

//Parse films using Cheerio
function parseFilm($: cheerio.CheerioAPI, el: Element): LetterboxdFilm {
  const description = $(el).find('description').text();
  const descriptionHtml = cheerio.load(description);

  return {
    title: $(el).find('title').text(),
    link: $(el).find('link').text(),
    pubDate: $(el).find('pubDate').text(),
    watchedDate: $(el).find('letterboxd\\:watchedDate').text(),
    rewatch: $(el).find('letterboxd\\:rewatch').text(),
    filmTitle: $(el).find('letterboxd\\:filmTitle').text(),
    filmYear: $(el).find('letterboxd\\:filmYear').text(),
    memberRating: $(el).find('letterboxd\\:memberRating').text(),
    description,
    imageUrl: descriptionHtml('img').attr('src'),
    creator: $(el).find('dc\\:creator').text(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const username = 'martinstereo'; // In production, get this from query params and validate
    const url = `https://letterboxd.com/${username}/rss`;

    // Check cache
    if (cache[url] && Date.now() - cache[url].timestamp < CACHE_DURATION) {
      return res.status(200).json({ films: cache[url].data });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const text = await response.text();
    const $ = cheerio.load(text, { xmlMode: true });

    const films = $('item')
      .map((_, el) => parseFilm($, el))
      .get();

    // Update cache
    cache[url] = { data: films, timestamp: Date.now() };

    res.status(200).json({ films });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    });
  }
}
