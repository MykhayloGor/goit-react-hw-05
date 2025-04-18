import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingMovies } from '../../services/api';
import s from './HomePage.module.css';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const trendingMovies = await getTrendingMovies();
        setMovies(trendingMovies);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError('Failed to load trending movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className={s.homePage}>
      <h1 className={s.title}>Trending Today</h1>
      
      {loading && <div className={s.loading}>Loading trending movies...</div>}
      
      {error && <div className={s.errorMessage}>{error}</div>}
      
      {!loading && !error && movies.length === 0 && (
        <div className={s.noResults}>No trending movies available</div>
      )}
      
      {movies.length > 0 && (
        <ul className={s.movieList}>
          {movies.map(movie => (
            <li key={movie.id} className={s.movieItem}>
              <Link to={`/movies/${movie.id}`} className={s.movieLink}>
                {movie.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}