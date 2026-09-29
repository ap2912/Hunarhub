import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import { formatINR } from '../utils/format.js';
import Rating from './Rating.jsx';
import SafeImage from './SafeImage.jsx';
import './EntrepreneurCard.css';

/** Border-based maker card. No shadows, restrained hover. */
export default function EntrepreneurCard({ entrepreneur, index }) {
  const { db, actions } = useStore();
  const saved = db.favorites.includes(entrepreneur.id);
  const catLabel = entrepreneur.categoryLabel || '';

  return (
    <article className="maker-card">
      <Link to={`/maker/${entrepreneur.id}`} className="maker-card-media" aria-label={`View profile of ${entrepreneur.name}`}>
        <SafeImage src={entrepreneur.avatar} alt={`Portrait of ${entrepreneur.name}, ${catLabel}`} className="img-cover" />
        {entrepreneur.verified && <span className="maker-card-verified">VERIFIED MAKER</span>}
        <button
          type="button"
          className={`maker-card-save${saved ? ' is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${entrepreneur.name}` : `Save ${entrepreneur.name}`}
          onClick={(e) => { e.preventDefault(); actions.toggleFavorite(entrepreneur.id); }}
        >
          {saved ? '★' : '☆'}
        </button>
      </Link>
      <div className="maker-card-body">
        {typeof index === 'number' && (
          <p className="maker-card-index">{String(index + 1).padStart(2, '0')}</p>
        )}
        <div>
          <h3 className="maker-card-name">
            <Link to={`/maker/${entrepreneur.id}`}>{entrepreneur.name}</Link>
          </h3>
          <p className="maker-card-meta">
            {catLabel.toUpperCase()} · {entrepreneur.city?.toUpperCase()}
          </p>
        </div>
        <Rating value={entrepreneur.rating} count={entrepreneur.reviewCount} size="sm" />
        <p className="maker-card-bio">{entrepreneur.bio?.split('.')[0]}.</p>
        <div className="maker-card-foot">
          <p className="maker-card-price">FROM {formatINR(entrepreneur.startingPrice)}</p>
          <Link to={`/maker/${entrepreneur.id}`} className="maker-card-cta">
            VIEW PROFILE <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
