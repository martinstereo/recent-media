import Image from 'next/image';
import { convertRatingToStars } from '@/utils/convertRatingToStars';
import { LetterboxdFilm } from '@/app/api/letterboxd/route';

import AutorenewIcon from '@mui/icons-material/Autorenew';

import './film.styles.scss';

interface FilmProps {
  film: LetterboxdFilm;
}

function Film({ film }: FilmProps) {
  const {
    /* link, */ watchedDate,
    rewatch,
    filmTitle,
    filmYear,
    memberRating,
    imageUrl,
  } = film;
  const ratingStars = convertRatingToStars(memberRating);
  const formattedDateWatched = new Date(watchedDate).toLocaleDateString('en-UK', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className='film-container'>
      <div className='image-container'>
        {/* Conditionally render the imageUrl */}
        {imageUrl ? (
          <div className='image-wrapper'>
            <Image
              src={`${imageUrl}`}
              alt={filmTitle}
              width={150}
              height={225}
              className='film-image'
              style={{ borderRadius: '5px' }}
            />
            <div className='overlay'>
              <span className='film-title'>
                {filmTitle} ({filmYear})
              </span>
            </div>
          </div>
        ) : (
          <div className='placeholder-image'>No Image Available</div>
        )}
      </div>
      <div className='film-details'>
        <div className='film-meta'>
          <div className='rating-container'>
            {ratingStars && <span className='rating'>{ratingStars}</span>}
            {rewatch === 'Yes' && (
              <span className='rewatch-icon'>
                <AutorenewIcon fontSize='small' />
              </span>
            )}
          </div>
          <span className='watched-date'>{formattedDateWatched}</span>
        </div>
      </div>
    </div>
  );
}
export default Film;
