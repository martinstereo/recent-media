'use client';
import { useEffect, useState } from 'react';
import { Category, Period } from '@/app/api/lastfm/route';
import MusicItem, { LastFmData } from '../music-item/music-item.component';
import Spinner from '../spinner/spinner.component';
import styles from './music-list.module.scss'; // Changed to use CSS modules

function MusicList() {
  const [category, setCategory] = useState<Category>('albums'); // tracks, albums, artists
  const [period, setPeriod] = useState<Period>('7day'); // 7day, 1month, 6month, 12month
  const [lastFmData, setLastFmData] = useState<LastFmData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/lastfm?category=${category}&period=${period}`);
        const data = await response.json();
        let items: LastFmData[] = [];

        if (category === 'tracks' && data.toptracks) {
          items = data.toptracks.track;
        } else if (category === 'albums' && data.topalbums) {
          items = data.topalbums.album;
        } else if (category === 'artists' && data.topartists) {
          items = data.topartists.artist;
        }
        setLastFmData(items);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category, period]);

  return (
    <div className={styles.musicContainer}>
      <div className={styles.dropdownContainer}>
        <h2>Recent Music</h2>
        <div className={styles.dropdownWrapper}>
          <select
            className='dropdown-menu'
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}>
            <option value='tracks'>tracks</option>
            <option value='albums'>albums</option>
            <option value='artists'>artists</option>
          </select>
          <span>over the last</span>
          <select
            className='dropdown-menu'
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}>
            <option value='7day'>7 days</option>
            <option value='1month'>month</option>
            <option value='6month'>6 months</option>
            <option value='12month'>12 months</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner type='lastfm' />
        </div>
      ) : (
        <div className={styles.musicList}>
          {lastFmData.map((item, index) => (
            <MusicItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
export default MusicList;
