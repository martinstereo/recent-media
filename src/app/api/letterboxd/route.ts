import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { CheerioAPI, load } from 'cheerio';
import type { Element } from 'domhandler';

export type LetterboxdFilm = {
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
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
      });
    }

    const response = await fetch(`https://letterboxd.com/${username}/rss`);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch RSS feed' }), {
        status: response.status,
      });
    }
    const rssData = await response.text();
    const $: CheerioAPI = load(rssData);
    const films: LetterboxdFilm[] = [];

    $('item').each((_, element) => {
      const film = parseFilm($, element);
      films.push(film);
    });

    return NextResponse.json({ films }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function parseFilm($: cheerio.CheerioAPI, el: Element): LetterboxdFilm {
  const descriptionHtml = $(el).find('description').html() || '';
  const descriptionText = $(el).find('description').text();

  const imgSrcMatch = descriptionHtml.match(/<img\s+src="([^"]+)"/);
  const imgSrc = imgSrcMatch ? imgSrcMatch[1] : undefined;

  return {
    description: descriptionText,
    title: $(el).find('title').text(),
    link: $(el).find('link').text(),
    pubDate: $(el).find('pubDate').text(),
    watchedDate: $(el).find('letterboxd\\:watchedDate').text(),
    rewatch: $(el).find('letterboxd\\:rewatch').text(),
    filmTitle: $(el).find('letterboxd\\:filmTitle').text(),
    filmYear: $(el).find('letterboxd\\:filmYear').text(),
    memberRating: $(el).find('letterboxd\\:memberRating').text(),
    imageUrl: imgSrc,
    creator: $(el).find('dc\\:creator').text(),
  };
}
