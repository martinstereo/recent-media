import { NextResponse } from 'next/server';

// Update types to match the actual API response structure
export type HardcoverImage = {
  id: number;
  url: string;
  color: string;
  width: number;
  height: number;
  color_name: string;
};

export type HardcoverAuthor = {
  id: number;
  slug: string;
  name: string;
  image?: HardcoverImage;
};

export type HardcoverContributor = {
  author: HardcoverAuthor;
  contribution: string | null;
};

export type HardcoverBook = {
  title: string;
  id?: string | number;
  cached_image?: HardcoverImage;
  cached_contributors?: HardcoverContributor[];
};

export type HardcoverBookRead = {
  started_at?: string;
  progress?: number;
  finished_at?: string;
};

export type HardcoverUserBook = {
  book: HardcoverBook;
  user_book_reads: HardcoverBookRead[];
  rating?: number;
};

export type ParsedBook = {
  readingStatus: string;
  bookTitle: string;
  guid?: string;
  pubDate: string;
  imageUrl: string;
  author: string;
  rating?: number;
};

// Test query to verify authentication
const testQuery = `
query Test {
  me {
    username
  }
}
`;

// GraphQL query remains the same
const booksQuery = `
query MyQuery {
  me {
    id
    user_books {
      book {
        title
        id
        cached_image
        cached_contributors
      }
      rating
      user_book_reads {
        started_at
        progress
        finished_at
      }
    }
  }
}
`;

async function fetchFromHardcover(query: string) {
  // This function remains unchanged
  const HARDCOVER_API_URL = 'https://api.hardcover.app/v1/graphql';
  const HARDCOVER_AUTH_KEY = process.env.HARDCOVER_AUTH_KEY;

  if (!HARDCOVER_AUTH_KEY) {
    throw new Error('HARDCOVER_AUTH_KEY is not defined in environment variables');
  }

  const graphqlRequest = {
    query: query,
    variables: {},
  };

  const response = await fetch(HARDCOVER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: HARDCOVER_AUTH_KEY,
    },
    body: JSON.stringify(graphqlRequest),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API error response:', errorText);
    throw new Error(`Hardcover API responded with status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

function parseBookData(userBooks: HardcoverUserBook[]): ParsedBook[] {
  if (!userBooks || !Array.isArray(userBooks)) {
    return [];
  }

  const parsedBooks: ParsedBook[] = [];

  for (const userBook of userBooks) {
    // Skip if no book or reads data
    if (
      !userBook.book ||
      !userBook.user_book_reads ||
      userBook.user_book_reads.length === 0
    ) {
      continue;
    }

    // Get the most recent read entry
    const latestRead = userBook.user_book_reads.reduce((latest, current) => {
      const latestDate = latest.finished_at || latest.started_at;
      const currentDate = current.finished_at || current.started_at;

      if (!latestDate) return current;
      if (!currentDate) return latest;

      return new Date(currentDate) > new Date(latestDate) ? current : latest;
    }, userBook.user_book_reads[0]);

    // Extract image URL from the cached_image object
    let imageUrl = '';
    if (userBook.book.cached_image && typeof userBook.book.cached_image === 'object') {
      imageUrl = userBook.book.cached_image.url || '';
    }

    // Extract author from cached_contributors array
    let author = 'Unknown';
    try {
      if (
        userBook.book.cached_contributors &&
        Array.isArray(userBook.book.cached_contributors)
      ) {
        // Get the first contributor that's the main author (no contribution or null contribution)
        const mainAuthor = userBook.book.cached_contributors.find(
          (c) => c.author && (!c.contribution || c.contribution === null)
        );

        if (mainAuthor) {
          author = mainAuthor.author.name;
        } else if (userBook.book.cached_contributors.length > 0) {
          // If no main author found, just use the first one
          author = userBook.book.cached_contributors[0].author.name;
        }
      }
    } catch (error) {
      console.warn('Failed to extract author:', error);
    }

    // Determine reading status and relevant date
    let readingStatus = 'unknown';
    let pubDate = '';

    if (latestRead.finished_at) {
      readingStatus = 'recently read';
      pubDate = latestRead.finished_at;
    } else if (latestRead.started_at) {
      readingStatus = 'currently reading';
      pubDate = latestRead.started_at;
    }

    // Only add books with a clear reading status
    if (readingStatus !== 'unknown') {
      parsedBooks.push({
        readingStatus,
        bookTitle: userBook.book.title,
        guid: userBook.book.id?.toString(),
        pubDate,
        imageUrl,
        author,
        rating: userBook.rating,
      });
    }
  }

  // Sort by date (most recent first)
  return parsedBooks.sort((a, b) => {
    const dateA = new Date(a.pubDate || 0).getTime();
    const dateB = new Date(b.pubDate || 0).getTime();
    return dateB - dateA;
  });
}

// GET function remains unchanged
export async function GET() {
  try {
    console.log('Testing authentication...');
    const testResponse = await fetchFromHardcover(testQuery);

    if (!testResponse.data?.me?.[0]?.username) {
      console.error('Authentication failed or structure unexpected:', testResponse);
      return NextResponse.json(
        { error: 'Authentication failed or user data not available' },
        { status: 401 }
      );
    }

    console.log('Authentication successful for user:', testResponse.data.me[0].username);

    // Fetch books with the new query
    const booksData = await fetchFromHardcover(booksQuery);

    if (!booksData.data?.me?.[0]?.user_books) {
      console.error('Unexpected response structure:', booksData);
      return NextResponse.json(
        { error: 'Unexpected response structure from Hardcover API' },
        { status: 500 }
      );
    }

    const userBooks = booksData.data.me[0].user_books;
    console.log(`Found ${userBooks.length} books total`);

    // Parse the results
    const result = parseBookData(userBooks);
    console.log(`Parsed ${result.length} books with reading status`);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching Hardcover data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { error: `Error fetching Hardcover data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
