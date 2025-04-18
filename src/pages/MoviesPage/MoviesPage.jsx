import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../../services/api';
import MovieList from '../../components/MovieList/MovieList';
import s from './MoviesPage.module.css';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }
    
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const results = await searchMovies(query);
        setMovies(results);
        console.log("Search results:", results); 
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.searchQuery.value.trim();
    
    if (!searchQuery) return;
    
    setSearchParams({ query: searchQuery });
  };

  return (
    <div className={s.moviesPage}>
      <form onSubmit={handleSubmit} className={s.searchForm}>
        <input
          type="text"
          name="searchQuery"
          defaultValue={query}
          placeholder="Search movies..."
          className={s.searchInput}
          required
        />
        <button type="submit" className={s.searchButton}>
          Search
        </button>
      </form>

      {loading && <div className={s.loading}>Searching...</div>}
      
      {error && <div className={s.errorMessage}>{error}</div>}
      
      {!loading && query && movies.length === 0 && (
        <div className={s.noResults}>No movies found for "{query}"</div>
      )}
      
      {movies.length > 0 && <MovieList movies={movies} />}
    </div>
  );
}