import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styled from './music-item.module.scss';

type LastFmImage = {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega';
};

type LastFmTrack = {
  name: string;
  playcount: string;
  artist: { name: string; url: string };
  image: LastFmImage[];
  url: string;
};

type LastFmAlbum = {
  name: string;
  playcount: string;
  artist: { name: string; url: string };
  image: LastFmImage[];
  url: string;
};

type LastFmArtist = {
  name: string;
  playcount: string;
  image: LastFmImage[];
  url: string;
};
export type LastFmData = LastFmTrack | LastFmAlbum | LastFmArtist;

interface MusicItemProps {
  item: LastFmData;
}

function MusicItem({ item }: MusicItemProps) {
  const { playcount, image } = item;
  const isArtist = 'artist' in item && !item.name;
  const itemName = isArtist ? item.artist.name : item.name;
  const artistName = !isArtist && 'artist' in item ? item.artist.name : null;
  const imageUrl = image[3]?.['#text']?.trim();

  const nameRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = (element: HTMLElement | null) => {
      if (!element) return;

      const hasOverflow = element.scrollWidth > element.clientWidth;
      if (hasOverflow) {
        element.classList.add(styled.scrollingText);
        element.style.setProperty('--text-width', `${element.scrollWidth}px`);
      } else {
        element.classList.remove(styled.scrollingText);
        element.style.removeProperty('--text-width');
      }
    };

    checkOverflow(nameRef.current);
    checkOverflow(artistRef.current);
  }, [itemName, artistName]);

  return (
    <div className={styled.container}>
      <div className={styled.imageContainer}>
        <Image
          src={imageUrl && imageUrl !== '' ? imageUrl : '/defaultLastFMImage.png'}
          alt={itemName}
          width={80}
          height={80}
          style={{ borderRadius: '5px' }}
        />
      </div>
      <div className={styled.textContainer}>
        <div ref={nameRef} className={styled.itemName}>
          {itemName}
        </div>
        {!isArtist && artistName && (
          <div ref={artistRef} className={styled.artistName}>
            {artistName}
          </div>
        )}
        <div className={styled.playCount}>{playcount} plays</div>
      </div>
    </div>
  );
}
export default MusicItem;
