import { useEffect, useState } from "react";
import { Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../../services/api";
import s from "./MovieDetailsPage.module.css";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backLinkHref = location.state?.from ?? "/movies";

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleGoBack = () => {
    navigate(backLinkHref);
  };

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className={s.movieDetails}>
      <button onClick={handleGoBack} className={s.backButton}>
        ← Go back
      </button>

      <div className={s.movieInfo}>
        <div className={s.posterContainer}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className={s.poster}
            />
          ) : (
            <div className={s.noPoster}>No poster available</div>
          )}
        </div>

        <div className={s.details}>
          <h1 className={s.title}>
            {movie.title} 
            {movie.release_date && (
              <span> ({new Date(movie.release_date).getFullYear()})</span>
            )}
          </h1>
          
          <p className={s.score}>User Score: {Math.round(movie.vote_average * 10)}%</p>
          
          <h2 className={s.sectionTitle}>Overview</h2>
          <p className={s.overview}>{movie.overview || 'No overview available'}</p>
          
          <h2 className={s.sectionTitle}>Genres</h2>
          <p className={s.genres}>
            {movie.genres?.length
              ? movie.genres.map(genre => genre.name).join(', ')
              : 'No genres available'}
          </p>
        </div>
      </div>

      <div className={s.additionalInfo}>
        <h3 className={s.additionalTitle}>Additional information</h3>
        <ul className={s.additionalLinks}>
          <li>
            <Link to="cast" className={s.infoLink}>Cast</Link>
          </li>
          <li>
            <Link to="reviews" className={s.infoLink}>Reviews</Link>
          </li>
        </ul>
      </div>

      <Outlet />
    </div>
  );
}