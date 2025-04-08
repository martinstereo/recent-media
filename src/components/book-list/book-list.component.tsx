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
          // Add leading slash
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
        console.log('Books from API:', result);

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
          {bookData.map((book, index) => (
            <Book key={index} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
