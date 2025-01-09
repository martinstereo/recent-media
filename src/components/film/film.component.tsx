import Image from 'next/image';
import { convertRatingToStars } from '@/utils/convertRatingToStars';
import { LetterboxdFilm } from '@/app/api/letterboxd/route';

import './film.styles.scss';

interface FilmProps {
  film: LetterboxdFilm;
}

function Film({ film }: FilmProps) {
  const { link, watchedDate, rewatch, filmTitle, filmYear, memberRating, imageUrl } =
    film;
  const ratingStars = convertRatingToStars(memberRating);

  return (
    <div className='film-container'>
      <div className='image-container'>
        <a href={`${link}`}>
          {/* Conditionally render the imageUrl */}
          {imageUrl ? (
            <Image src={`${imageUrl}`} alt={filmTitle} width={200} height={300} />
          ) : (
            <div className='placeholder-image'>No Image Available</div>
          )}
        </a>
      </div>
      <div className='film-details'>
        <h2>
          {filmTitle} ({filmYear})
        </h2>

        {ratingStars ? (
          <p>
            Rating: {ratingStars} {rewatch === 'Yes' && <span>🔄</span>}
          </p>
        ) : (
          rewatch === 'Yes' && <span>🔄</span>
        )}

        <p>Date Watched: {watchedDate}</p>
      </div>
    </div>
  );
}
export default Film;
