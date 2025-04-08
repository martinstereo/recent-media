'use client';
import { useState, useEffect } from 'react';
import styles from './navbar.module.scss';

function Navbar() {
  const [activeSection, setActiveSection] = useState('films');
  const [showTitle, setShowTitle] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Hide title when scrolling down, show when scrolling up
      if (scrollPosition > lastScrollY && scrollPosition > 50) {
        setShowTitle(false);
      } else if (scrollPosition < lastScrollY) {
        setShowTitle(true);
      }
      setLastScrollY(scrollPosition);

      // Get positions of each section
      const filmSection = document.getElementById('films-section')?.offsetTop || 0;
      const musicSection = document.getElementById('music-section')?.offsetTop || 0;
      const booksSection = document.getElementById('books-section')?.offsetTop || 0;

      // Set active based on scroll position
      const adjustedPosition = scrollPosition + 100;
      if (adjustedPosition >= booksSection) {
        setActiveSection('books');
      } else if (adjustedPosition >= musicSection) {
        setActiveSection('music');
      } else if (adjustedPosition >= filmSection) {
        setActiveSection('films');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
      const navHeight = document.querySelector(`.${styles.container}`)?.clientHeight || 0;
      window.scrollTo({
        top: section.offsetTop - navHeight - 10,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className={`${styles.container} ${showTitle ? '' : styles.compact}`}>
      <div className={styles.titleContainer}>
        <h1 className={styles.navbarTitle}>martin&apos;s recent media</h1>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navLinks}>
          <li className={activeSection === 'films' ? styles.active : ''}>
            <button onClick={() => scrollToSection('films')}>Films</button>
          </li>
          <li className={activeSection === 'music' ? styles.active : ''}>
            <button onClick={() => scrollToSection('music')}>Music</button>
          </li>
          <li className={activeSection === 'books' ? styles.active : ''}>
            <button onClick={() => scrollToSection('books')}>Books</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
