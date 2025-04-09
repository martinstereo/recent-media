'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/navbar.component';
import FilmList from '@/components/film-list/film-list.component';
import BookList from '@/components/book-list/book-list.component';
import MusicList from '@/components/music-list/music-list.component';
import Footer from '@/components/footer/footer.component';
import styles from './page.module.scss';

type SectionType = 'films' | 'books' | 'music';

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionType>('films');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    // Initial check
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.page}>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className={styles.main}>
        <div className={styles.mediaContainer}>
          <div
            className={`${styles.section} ${
              isMobile && activeSection !== 'films' ? styles.hidden : styles.visible
            }`}>
            <FilmList />
          </div>
          <div
            className={`${styles.section} ${
              isMobile && activeSection !== 'books' ? styles.hidden : styles.visible
            }`}>
            <BookList />
          </div>
          <div
            className={`${styles.section} ${
              isMobile && activeSection !== 'music' ? styles.hidden : styles.visible
            }`}>
            <MusicList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
