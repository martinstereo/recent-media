import { NextResponse } from 'next/server';

// Update types to match actual API structure
export type HardcoverBook = {
  title: string;
  id?: string;
  image?: {
    url: string;
  };
  release_year?: number;
  contributions?: {
    author: {
      name: string;
    };
  }[];
};

export type HardcoverUserBook = {
  rating?: number;
  book: HardcoverBook;
  date_added?: string; // This replaces started_at/finished_at
  status_id: number;
};

export type ParsedBook = {
  readingStatus: string;
  bookTitle: string;
  guid: string;
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

// GraphQL query for currently reading books - with sorting
const currentlyReadingQuery = `
query CurrentlyReading {
  me {
    user_books(where: {status_id: {_eq: 2}}, order_by: {date_added: desc}) {
      date_added
      rating
      book {
        id
        title
        image {
          url
        }
        release_year
        contributions {
          author {
            name
          }
        }
      }
    }
  }
}
`;

// GraphQL query for recently read books - with sorting
const recentlyReadQuery = `
query RecentlyRead {
  me {
    user_books(where: {status_id: {_eq: 3}}, limit: 15, order_by: {date_added: desc}) {
      date_added
      rating
      book {
        id
        title
        image {
          url
        }
        release_year
        contributions {
          author {
            name
          }
        }
      }
    }
  }
}
`;

async function fetchFromHardcover(query: string) {
  const HARDCOVER_API_URL = 'https://api.hardcover.app/v1/graphql';
  const HARDCOVER_AUTH_KEY = process.env.HARDCOVER_AUTH_KEY;

  if (!HARDCOVER_AUTH_KEY) {
    throw new Error('HARDCOVER_AUTH_KEY is not defined in environment variables');
  }

  const graphqlRequest = {
    query: query,
    variables: {},
  };

  console.log('Sending GraphQL request:', JSON.stringify(graphqlRequest));

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
  console.log('API response structure:', JSON.stringify(data, null, 2));
  return data;
}

function parseBookData(
  currentlyReading: HardcoverUserBook[],
  recentlyRead: HardcoverUserBook[]
): ParsedBook[] {
  const currentlyReadingBooks = currentlyReading.map((userBook) => ({
    readingStatus: 'currently reading',
    bookTitle: userBook.book.title,
    guid: userBook.book.id || '',
    pubDate: userBook.date_added || '',
    imageUrl: userBook.book.image?.url || '',
    author: userBook.book.contributions?.[0]?.author?.name || 'Unknown',
    rating: userBook.rating,
  }));

  const recentlyReadBooks = recentlyRead.map((userBook) => ({
    readingStatus: 'recently read',
    bookTitle: userBook.book.title,
    guid: userBook.book.id || '',
    pubDate: userBook.date_added || '',
    imageUrl: userBook.book.image?.url || '',
    author: userBook.book.contributions?.[0]?.author?.name || 'Unknown',
    rating: userBook.rating,
  }));

  // Combine books and sort by date (most recent first)
  const allBooks = [...currentlyReadingBooks, ...recentlyReadBooks];
  return allBooks.sort((a, b) => {
    const dateA = new Date(a.pubDate || 0).getTime();
    const dateB = new Date(b.pubDate || 0).getTime();
    return dateB - dateA; // Sort descending (newest first)
  });
}

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

    // Fetch currently reading books
    const currentlyReadingData = await fetchFromHardcover(currentlyReadingQuery);

    let currentlyReadingBooks = [];
    if (currentlyReadingData.data?.me?.[0]?.user_books) {
      currentlyReadingBooks = currentlyReadingData.data.me[0].user_books;
      console.log(`Found ${currentlyReadingBooks.length} currently reading books`);
    } else {
      console.warn('Unexpected response structure for currently reading books');
    }

    // Fetch recently read books
    const recentlyReadData = await fetchFromHardcover(recentlyReadQuery);

    let recentlyReadBooks = [];
    if (recentlyReadData.data?.me?.[0]?.user_books) {
      recentlyReadBooks = recentlyReadData.data.me[0].user_books;
      console.log(`Found ${recentlyReadBooks.length} recently read books`);
    } else {
      console.warn('Unexpected response structure for recently read books');
    }

    // Parse and combine the results
    const result = parseBookData(currentlyReadingBooks, recentlyReadBooks);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching Hardcover data:', error);
    // Fix the type error by checking if error is an Error object
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(
      { error: `Error fetching Hardcover data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
