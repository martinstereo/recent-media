'use client';
import Film from '../film/film.component';
import Spinner from '../spinner/spinner.component';
import { useEffect, useState } from 'react';

import { LetterboxdFilm } from '@/app/api/letterboxd/route';
import './film-list.styles.scss';

const SPINNER_TYPE = 'letterboxd';

function FilmList() {
  const [letterboxdData, setLetterboxdData] = useState<{
    films: LetterboxdFilm[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLetterboxdData = async () => {
      setIsLoading(true);
      try {
        const username = 'martinstereo';
        const response = await fetch(`/api/letterboxd?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        setLetterboxdData({
          films: result.films.slice(0, 8),
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchLetterboxdData();
  }, []);

  return (
    <div className='films-container'>
      <div className='films-header'>
        <h2>recently watched films</h2>
      </div>
      {!isLoading && letterboxdData ? (
        <div className='film-list-container'>
          {letterboxdData.films.map((film, index) => (
            <Film key={index} film={film} />
          ))}
        </div>
      ) : (
        <div className='spinner-container'>
          <Spinner type={SPINNER_TYPE} />
        </div>
      )}
    </div>
  );
}
export default FilmList;
