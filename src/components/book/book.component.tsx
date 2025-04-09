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

  // Determine image source with fallback - fixed to handle non-string values
  const getImageSource = () => {
    if (typeof imageUrl === 'string' && imageUrl.trim() && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // If path is not a valid URL string, use placeholder
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
          width={80}
          height={120}
          className={styles.coverImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{bookTitle}</h3>
        <p className={styles.bookAuthor}>{author}</p>

        {/* For currently reading books, show date before potential rating */}
        {readingStatus === 'currently reading' && (
          <p className={styles.bookDate}>Started: {formattedDate}</p>
        )}

        {/* Show rating (for recently read books) */}
        {renderRating()}

        {/* For finished books, show date at the bottom after rating */}
        {readingStatus === 'recently read' && (
          <p className={`${styles.bookDate} ${styles.finishedDate}`}>
            Finished: {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}

export default Book;
