'use client';
import { useState, useEffect } from 'react';
import styles from './navbar.module.scss';

type SectionType = 'films' | 'books' | 'music';

interface NavbarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set up scroll listener for compact navbar effect
  // and resize listener for mobile detection
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    // Initialize on mount
    handleResize();

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle section click
  const handleSectionClick = (section: SectionType) => {
    setActiveSection(section);
  };

  return (
    <header className={`${styles.container} ${isCompact ? styles.compact : ''}`}>
      <div className={styles.titleContainer}>
        <h1 className={styles.navbarTitle}>Martin&apos;s Recent Media</h1>
      </div>

      {/* Only show navigation on mobile */}
      {isMobile && (
        <nav className={styles.navigation}>
          <ul className={styles.navLinks}>
            <li className={activeSection === 'films' ? styles.active : ''}>
              <button onClick={() => handleSectionClick('films')}>Films</button>
            </li>
            <li className={activeSection === 'books' ? styles.active : ''}>
              <button onClick={() => handleSectionClick('books')}>Books</button>
            </li>
            <li className={activeSection === 'music' ? styles.active : ''}>
              <button onClick={() => handleSectionClick('music')}>Music</button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
