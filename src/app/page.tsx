import MusicList from '@/components/music-list/music-list.component';
import Navbar from '@/components/navbar/navbar.component';
import styles from './page.module.css';
import FilmList from '@/components/film-list/film-list.component';
import Footer from '@/components/footer/footer.component';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main}>
        <FilmList />
        <MusicList />
      </main>
      <Footer />
    </div>
  );
}
