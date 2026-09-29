import { useState } from 'react';
import './SearchBar.css';

/**
 * Intentional search input with suggestion dropdown.
 * suggestions: array of strings shown on focus.
 */
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search skills, makers, products…', suggestions = [], id = 'site-search' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="searchbar" role="search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFocused(false);
          onSubmit?.(value);
        }}
      >
        <label className="visually-hidden" htmlFor={id}>{placeholder}</label>
        <span className="searchbar-icon" aria-hidden="true">⌕</span>
        <input
          id={id}
          type="search"
          className="searchbar-input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        <button type="submit" className="searchbar-go" aria-label="Search">→</button>
      </form>
      {focused && suggestions.length > 0 && (
        <ul className="searchbar-suggestions" aria-label="Popular searches">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onChange(s); setFocused(false); onSubmit?.(s); }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
