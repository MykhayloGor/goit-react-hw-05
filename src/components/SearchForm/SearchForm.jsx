import { useState } from 'react';
import s from './SearchForm.module.css';

export default function SearchForm({ onSubmit, initialValue = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      alert('Please enter a search query');
      return;
    }
    onSubmit(searchQuery);
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <input
        className={s.input}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search movies..."
        autoComplete="off"
        autoFocus
      />
      <button type="submit" className={s.button}>
        Search
      </button>
    </form>
  );
}