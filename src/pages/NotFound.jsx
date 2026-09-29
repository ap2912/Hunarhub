import SectionLabel from '../components/SectionLabel.jsx';
import Button from '../components/Button.jsx';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="container section not-found">
      <SectionLabel index="404">Page not found</SectionLabel>
      <h1 className="page-title">
        This page<br />doesn't <span className="text-accent">exist.</span>
      </h1>
      <p className="not-found-text text-muted">
        The link you followed may be broken, or the page may have been moved.
      </p>
      <div className="not-found-actions">
        <Button to="/">Back to home</Button>
        <Button to="/explore" variant="secondary">Explore talent</Button>
      </div>
    </div>
  );
}
