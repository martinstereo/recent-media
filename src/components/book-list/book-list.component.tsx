'use client';
import { useEffect, useState } from 'react';

import Spinner from '../spinner/spinner.component';
import Book from '../book/book.component';
import { ParsedBook } from '@/app/api/hardcover/route';

import styles from './book-list.module.scss';

function BookList() {
  const [bookData, setBookData] = useState<ParsedBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooksFromHardcover = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/hardcover', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching books: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setBookData(result);
        } else if (result.error) {
          console.error('API returned error:', result.error);
        } else {
          console.error('Unexpected response format:', result);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooksFromHardcover();
  }, []);

  // Filter books by reading status
  const currentlyReadingBooks = bookData.filter(
    (book) => book.readingStatus === 'currently reading'
  );
  const recentlyReadBooks = bookData.filter(
    (book) => book.readingStatus === 'recently read'
  );

  return (
    <div className={styles.booksContainer}>
      <div className={styles.booksHeader}>
        <h2>Recent Books</h2>
      </div>
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner type='hardcover' />
        </div>
      ) : (
        <div className={styles.bookListContainer}>
          <div className={styles.bookSection}>
            <h3 className={styles.sectionTitle}>Currently Reading</h3>
            {currentlyReadingBooks.length > 0 ? (
              currentlyReadingBooks.map((book, index) => (
                <Book key={`reading-${index}`} book={book} />
              ))
            ) : (
              <p className={styles.emptyMessage}>No books currently being read</p>
            )}
          </div>

          <div className={styles.bookSection}>
            <h3 className={styles.sectionTitle}>Recently Read</h3>
            {recentlyReadBooks.length > 0 ? (
              recentlyReadBooks.map((book, index) => (
                <Book key={`read-${index}`} book={book} />
              ))
            ) : (
              <p className={styles.emptyMessage}>No recently read books</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
