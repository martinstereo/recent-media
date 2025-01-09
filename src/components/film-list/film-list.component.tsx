import Film from '../film/film.component';

import { LetterboxdFilm } from '@/app/api/letterboxd/route';

import './film-list.styles.scss';

interface FilmListProps {
  films: LetterboxdFilm[];
}

function FilmList({ films }: FilmListProps) {
  console.log(films);
  return (
    <div className='film-list-container'>
      {films.map((film, index) => (
        <Film key={index} film={film} />
      ))}
    </div>
  );
}
export default FilmList;
