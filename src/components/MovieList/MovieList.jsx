import { Link, useLocation } from 'react-router-dom';
import s from './MovieList.module.css';

export default function MovieList({ movies }) {
  const location = useLocation();
  
  return (
    <ul className={s.movieList}>
      {movies.map(movie => (
        <li key={movie.id} className={s.movieItem}>
          <Link 
            to={`/movies/${movie.id}`} 
            state={{ from: location }} 
            className={s.movieLink}
          >
            {movie.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}