import { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import { getMovieCast } from "../../services/api";
import s from "./MovieCast.module.css";

export default function MovieCast() {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultImg =
    "https://dl-media.viber.com/10/share/2/long/vibes/icon/image/0x0/95e0/5688fdffb84ff8bed4240bcf3ec5ac81ce591d9fa9558a3a968c630eaba195e0.jpg";

  useEffect(() => {
    if (!movieId) return;

    const fetchCast = async () => {
      try {
        setLoading(true);
        const castData = await getMovieCast(movieId);
        setCast(castData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [movieId]);

  if (loading) return <div>Loading cast...</div>;
  if (error) return <div>Error: {error}</div>;
  if (cast.length === 0) return <div>No cast information available</div>;

  return (
    <div className={s.castContainer}>
      <h3>Cast</h3>
      <ul className={s.castList}>
        {cast.map((actor) => (
          <li key={actor.id} className={s.castItem}>
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : defaultImg
              }
              alt={actor.name}
              className={s.actorImage}
            />
            <div className={s.actorInfo}>
              <p className={s.actorName}>{actor.name}</p>
              <p className={s.character}>Character: {actor.character}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
