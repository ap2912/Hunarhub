import { Link } from 'react-router-dom';
import { useStore, getEntrepreneur } from '../store/StoreContext.jsx';
import { formatINR } from '../utils/format.js';
import Rating from './Rating.jsx';
import SafeImage from './SafeImage.jsx';
import Button from './Button.jsx';
import './ProductCard.css';

/** Border-based product card. */
export default function ProductCard({ product }) {
  const { db, actions } = useStore();
  const maker = getEntrepreneur(db, product.entrepreneurId);
  const out = product.stock <= 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-media" aria-label={`View ${product.name}`}>
        <SafeImage src={product.image} alt={product.name} className="img-cover" />
        {out && <span className="product-card-stock">SOLD OUT</span>}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="product-card-stock is-low">ONLY {product.stock} LEFT</span>
        )}
      </Link>
      <div className="product-card-body">
        <h3 className="product-card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        {maker && (
          <p className="product-card-maker">
            by <Link to={`/maker/${maker.id}`}>{maker.businessName}</Link>
            <span className="product-card-loc"> · {maker.city} / {maker.state}</span>
          </p>
        )}
        <Rating value={product.rating} count={product.reviewCount} size="sm" />
        <div className="product-card-foot">
          <p className="product-card-price">{formatINR(product.price)}</p>
          <Button
            size="sm"
            variant="secondary"
            disabled={out}
            onClick={() => actions.addToCart(product.id, 1)}
            aria-label={out ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            {out ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </article>
  );
}
