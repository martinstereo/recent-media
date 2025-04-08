import MusicList from '@/components/music-list/music-list.component';
import Navbar from '@/components/navbar/navbar.component';
import FilmList from '@/components/film-list/film-list.component';
import Footer from '@/components/footer/footer.component';

import styles from './page.module.scss';
import BookList from '@/components/book-list/book-list.component';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main}>
        <section id='films-section' className={styles.section}>
          <FilmList />
        </section>
        <section id='music-section' className={styles.section}>
          <MusicList />
        </section>
        <section id='books-section' className={styles.section}>
          <BookList />
        </section>
      </main>
      <Footer />
    </div>
  );
}
