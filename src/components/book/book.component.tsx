import Image from 'next/image';
import { ParsedBook } from '@/app/api/hardcover/route';
import styles from './book.module.scss';

type BookProps = {
  book: ParsedBook;
};

function Book({ book }: BookProps) {
  const { bookTitle, imageUrl, author, pubDate, readingStatus, rating } = book;

  // Format the date for display
  const formattedDate = pubDate
    ? new Date(pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  // Determine image source with fallback
  const getImageSource = () => {
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If path is relative or empty, use placeholder
    return '/placeholder-book.jpg';
  };

  // Render stars for rating if available
  const renderRating = () => {
    if (rating && readingStatus === 'recently read') {
      return (
        <div className={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? styles.filledStar : styles.emptyStar}>
              {i < rating ? '★' : '☆'}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}>
        <Image
          src={getImageSource()}
          alt={`${bookTitle} by ${author}`}
          width={150} // Updated to match music/film covers
          height={225} // Adjusted to maintain aspect ratio
          className={styles.coverImage}
        />
      </div>
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{bookTitle}</h3>
        <p className={styles.bookAuthor}>{author}</p>
        <p className={styles.bookDate}>
          {readingStatus === 'currently reading' ? 'Started: ' : 'Finished: '}
          {formattedDate}
        </p>
        {renderRating()}
      </div>
    </div>
  );
}

export default Book;
