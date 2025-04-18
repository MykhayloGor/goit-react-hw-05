import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieReviews } from "/src/services/api.js";
import s from "./MovieReviews.module.css";

export default function MovieReviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getMovieReviews(movieId);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;
  if (reviews.length === 0) return <div>No reviews available</div>;

  return (
    <div className={s.reviewsContainer}>
      <h3>Reviews</h3>
      <ul className={s.reviewsList}>
        {reviews.map((review) => (
          <li key={review.id} className={s.reviewItem}>
            <h4 className={s.reviewAuthor}>Author: {review.author}</h4>
            <p className={s.reviewContent}>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
