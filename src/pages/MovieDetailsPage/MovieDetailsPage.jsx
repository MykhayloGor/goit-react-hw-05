import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieCast,
  getMovieReviews,
} from "../../services/api";
import s from "./MovieDetailsPage.module.css";

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("cast");

  const backLinkHref = location.state?.from || "/";

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);

        const [castData, reviewsData] = await Promise.all([
          getMovieCast(movieId),
          getMovieReviews(movieId),
        ]);

        setCast(castData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return <div className={s.loading}>Loading movie details...</div>;
  }

  if (error) {
    return <div className={s.error}>{error}</div>;
  }

  if (!movie) {
    return <div className={s.notFound}>Movie not found</div>;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className={s.movieDetailsContainer}>
      <Link to={backLinkHref} className={s.backLink}>
        ← Go back
      </Link>

      <div className={s.movieHeader}>
        <div className={s.posterContainer}>
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className={s.poster}
          />
        </div>

        <div className={s.movieInfo}>
          <h1 className={s.title}>
            {movie.title}
            <span className={s.releaseYear}>
              (
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
              )
            </span>
          </h1>

          <div className={s.userScore}>
            <span className={s.scoreValue}>
              {movie.vote_average ? Math.round(movie.vote_average * 10) : 0}%
            </span>
            <span className={s.scoreLabel}>User Score</span>
          </div>

          <div className={s.overview}>
            <h2>Overview</h2>
            <p>{movie.overview || "No overview available."}</p>
          </div>

          <div className={s.genres}>
            <h2>Genres</h2>
            <div className={s.genresList}>
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map((genre) => (
                  <span key={genre.id} className={s.genreTag}>
                    {genre.name}
                  </span>
                ))
              ) : (
                <span>No genres listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={s.additionalInfo}>
        <h2 className={s.additionalTitle}>Additional Information</h2>

        <div className={s.tabs}>
          <button
            className={`${s.tabButton} ${
              activeTab === "cast" ? s.activeTab : ""
            }`}
            onClick={() => setActiveTab("cast")}
          >
            Cast
          </button>
          <button
            className={`${s.tabButton} ${
              activeTab === "reviews" ? s.activeTab : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className={s.tabContent}>
          {activeTab === "cast" && (
            <div className={s.castList}>
              {cast.length > 0 ? (
                cast.slice(0, 10).map((actor) => (
                  <div key={actor.id} className={s.castMember}>
                    <div className={s.castImageContainer}>
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : "https://via.placeholder.com/200x300?text=No+Image"
                        }
                        alt={actor.name}
                        className={s.castImage}
                      />
                    </div>
                    <div className={s.castInfo}>
                      <p className={s.castName}>{actor.name}</p>
                      <p className={s.castCharacter}>{actor.character}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={s.noContent}>No cast information available.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className={s.reviewsList}>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className={s.reviewItem}>
                    <div className={s.reviewHeader}>
                      <p className={s.reviewAuthor}>Author: {review.author}</p>
                      {review.author_details?.rating && (
                        <p className={s.reviewRating}>
                          Rating: {review.author_details.rating}/10
                        </p>
                      )}
                    </div>
                    <p className={s.reviewContent}>
                      {review.content.length > 300
                        ? `${review.content.substring(0, 300)}...`
                        : review.content}
                    </p>
                    {review.content.length > 300 && (
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.readMoreLink}
                      >
                        Read full review
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className={s.noContent}>
                  No reviews available for this movie.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
