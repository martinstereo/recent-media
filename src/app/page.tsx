'use client';
import { useEffect, useState } from 'react';
import FilmList from '@/components/film-list/film-list.component';
import { LetterboxdFilm } from './api/letterboxd/route';
import styles from './page.module.css';

export default function Home() {
  const [letterboxdData, setLetterboxdData] = useState<{
    films: LetterboxdFilm[];
  } | null>(null);

  useEffect(() => {
    async function fetchLetterboxdData() {
      const username = 'martinstereo';
      const response = await fetch(`/api/letterboxd?username=${username}`);
      const result = await response.json();
      setLetterboxdData({
        films: result.films.slice(0, 8),
      });
    }

    fetchLetterboxdData();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.filmsContainer}>
          <h2 className={styles.mediaTitle}>
            martinstereo&apos;s recently watched films!
          </h2>
          {letterboxdData ? (
            <FilmList films={letterboxdData.films} />
          ) : (
            <p>Loading Films...</p>
          )}
        </div>
      </main>
    </div>
  );
}
