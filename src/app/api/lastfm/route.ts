const LASTFM_USERNAME = process.env.LASTFM_USERNAME;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

const endpointMap: Record<Category, string> = {
  tracks: 'user.getTopTracks',
  albums: 'user.getTopAlbums',
  artists: 'user.getTopArtists',
};

export type Category = 'tracks' | 'albums' | 'artists';

export type Period = '7day' | '1month' | '6month' | '12month';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') as Category;
    const period = url.searchParams.get('period') as Period;

    if (!category || !period) {
      return new Response('Missing category or period', { status: 400 });
    }

    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=${endpointMap[category]}&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=10`
    );
    const json = await res.json();
    return new Response(JSON.stringify(json), { status: 200 });
  } catch {
    return new Response('Error fetching data', { status: 500 });
  }
}
