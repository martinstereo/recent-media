import Image from 'next/image';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import styles from './film.module.scss';
import { convertRatingToStars } from '@/utils/convertRatingToStars';

type FilmProps = {
  film: {
    filmTitle: string;
    filmYear?: string;
    watchedDate: string;
    memberRating?: string; // Changed from rating to memberRating to match Letterboxd API
    rewatch?: string;
    imageUrl?: string;
  };
};

function Film({ film }: FilmProps) {
  const { filmTitle, filmYear, watchedDate, memberRating, rewatch, imageUrl } = film;

  // Use the proper utility function to handle half-stars
  const ratingStars = memberRating ? convertRatingToStars(memberRating) : null;

  // Format date for better display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      // Log the error properly or handle it according to your needs
      console.error('Error formatting date:', error);
      return dateString; // Return the original string as fallback
    }
  };

  return (
    <div className={styles.filmContainer}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={filmTitle}
              width={80}
              height={120}
              className={styles.filmImage}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className={styles.placeholderImage}>No Image</div>
        )}
      </div>
      <div className={styles.filmDetails}>
        <div className={styles.filmTitle}>
          {filmTitle} {filmYear && `(${filmYear})`}
        </div>
        <div className={styles.filmMeta}>
          <div className={styles.ratingContainer}>
            {ratingStars && <span className={styles.rating}>{ratingStars}</span>}
            {rewatch === 'Yes' && (
              <span className={styles.rewatchIcon} title='Rewatch'>
                <AutorenewIcon fontSize='small' />
              </span>
            )}
          </div>
          <span className={styles.watchedDate}>Watched: {formatDate(watchedDate)}</span>
        </div>
      </div>
    </div>
  );
}

export default Film;
