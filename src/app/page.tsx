'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import FilmList from '@/components/film-list/film-list.component';
import { LetterboxdFilm } from './api/letterboxd/route';

export default function Home() {
  const [letterboxdData, setLetterboxdData] = useState<{
    films: LetterboxdFilm[];
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const username = 'martinstereo';
      const response = await fetch(`/api/letterboxd?username=${username}`);
      const result = await response.json();
      setLetterboxdData({
        films: result.films.slice(0, 50),
      });
    }

    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <div className='films-container'>
        <h1>Letterboxd Data</h1>
        {letterboxdData ? (
          <FilmList films={letterboxdData.films} />
        ) : (
          <p>Loading Films...</p>
        )}
      </div>
    </div>
  );
}
