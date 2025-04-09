'use client';
import Film from '../film/film.component';
import Spinner from '../spinner/spinner.component';
import { useEffect, useState } from 'react';

import { LetterboxdFilm } from '@/app/api/letterboxd/route';
import styles from './film-list.module.scss';

const SPINNER_TYPE = 'letterboxd';

function FilmList() {
  const [letterboxdData, setLetterboxdData] = useState<{
    films: LetterboxdFilm[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetterboxdData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const username = 'martinstereo';
        const response = await fetch(`/api/letterboxd?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch films`);
        }

        const result = await response.json();
        setLetterboxdData({
          films: result.films.slice(0, 20),
        });
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : 'Failed to load films');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetterboxdData();
  }, []);

  return (
    <section className={styles.filmsContainer} aria-labelledby='films-heading'>
      <div className={styles.filmsHeader}>
        <h2 id='films-heading'>Recent Films</h2>
      </div>

      {error && (
        <div className={styles.errorMessage} role='alert'>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.spinnerContainer} aria-live='polite'>
          <Spinner type={SPINNER_TYPE} />
          <span className='sr-only'>Loading films...</span>
        </div>
      ) : (
        <div className={styles.filmListContainer} role='list' aria-label='Film list'>
          {letterboxdData?.films.map((film, index) => (
            <div key={index} role='listitem'>
              <Film film={film} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
export default FilmList;
