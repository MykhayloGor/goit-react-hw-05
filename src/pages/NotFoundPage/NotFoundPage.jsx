import { Link } from 'react-router-dom';
import s from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={s.container}>
      <h1 className={s.title}>404</h1>
      <p className={s.message}>The page you are looking for doesn't exist.</p>
      <Link to="/" className={s.link}>
        Go to Home Page
      </Link>
    </div>
  );
}