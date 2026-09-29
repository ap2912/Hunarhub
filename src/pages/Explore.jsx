import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, getEntrepreneur } from '../store/StoreContext.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import EntrepreneurCard from '../components/EntrepreneurCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useReveal from '../hooks/useReveal.js';
import './Explore.css';

const DEFAULT_FILTERS = {
  type: 'all',
  category: 'all',
  location: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  availableOnly: false,
};

const SUGGESTIONS = ['POTTERS', 'TAILORS', 'HANDMADE CERAMICS', 'JAIPUR', 'LEATHER CRAFT', 'BAMBOO'];

function makerLocation(e) {
  return [e.city, e.state].filter(Boolean).join(', ');
}

export default function Explore() {
  const { db } = useStore();
  const [params] = useSearchParams();
  useReveal();

  const [query, setQuery] = useState(params.get('q') || '');
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    type: ['makers', 'products', 'all'].includes(params.get('type')) ? params.get('type') : 'all',
    category: params.get('category') || 'all',
  });
  const [sort, setSort] = useState('featured');

  const locations = useMemo(
    () => [...new Set(db.entrepreneurs.map(makerLocation).filter(Boolean))].sort(),
    [db.entrepreneurs],
  );

  const q = query.trim().toLowerCase();
  const priceIn = (price) => {
    const min = filters.minPrice === '' ? 0 : Number(filters.minPrice);
    const max = filters.maxPrice === '' ? Infinity : Number(filters.maxPrice);
    return price >= min && price <= max;
  };

  const makers = useMemo(() => {
    if (filters.type === 'products') return [];
    let list = db.entrepreneurs.filter((e) => e.status !== 'suspended');
    if (q) {
      list = list.filter((e) =>
        [e.name, e.businessName, e.categoryLabel, e.city, e.state, ...(e.skills || [])]
          .join(' ').toLowerCase().includes(q),
      );
    }
    if (filters.category !== 'all') list = list.filter((e) => e.category === filters.category);
    if (filters.location !== 'all') list = list.filter((e) => makerLocation(e) === filters.location);
    if (filters.minRating > 0) list = list.filter((e) => e.rating >= filters.minRating);
    if (filters.availableOnly) list = list.filter((e) => e.available);
    if (filters.minPrice !== '' || filters.maxPrice !== '') list = list.filter((e) => priceIn(e.startingPrice));
    const sorted = [...list];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'price-asc') sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    else sorted.sort((a, b) => Number(b.verified) - Number(a.verified) || b.reviewCount - a.reviewCount);
    return sorted;
  }, [db.entrepreneurs, q, filters, sort]);

  const products = useMemo(() => {
    if (filters.type === 'makers') return [];
    let list = db.products.filter((p) => {
      const maker = getEntrepreneur(db, p.entrepreneurId);
      return maker && maker.status !== 'suspended';
    });
    if (q) {
      list = list.filter((p) => {
        const maker = getEntrepreneur(db, p.entrepreneurId);
        return [p.name, p.description, p.material, maker?.businessName, maker?.name, maker?.city]
          .join(' ').toLowerCase().includes(q);
      });
    }
    if (filters.category !== 'all') list = list.filter((p) => p.category === filters.category);
    if (filters.location !== 'all') {
      list = list.filter((p) => makerLocation(getEntrepreneur(db, p.entrepreneurId) || {}) === filters.location);
    }
    if (filters.minRating > 0) list = list.filter((p) => p.rating >= filters.minRating);
    if (filters.minPrice !== '' || filters.maxPrice !== '') list = list.filter((p) => priceIn(p.price));
    const sorted = [...list];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    return sorted;
  }, [db, q, filters, sort]);

  const total = makers.length + products.length;
  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery('');
    setSort('featured');
  };

  return (
    <div className="explore">
      <div className="container">
        <div className="explore-head reveal">
          <SectionLabel index="01">Explore</SectionLabel>
          <h1 className="page-title">
            Talent, near <span className="text-accent">you.</span>
          </h1>
          <div className="explore-search">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={setQuery}
              suggestions={SUGGESTIONS}
              placeholder="Search skills, makers, products…"
            />
          </div>
        </div>

        <div className="explore-layout">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetAll}
            categories={db.categories}
            locations={locations}
            resultCount={total}
          />

          <div className="explore-results">
            <div className="explore-toolbar">
              <p className="explore-count" aria-live="polite">
                {total} result{total === 1 ? '' : 's'}
                {q && <> for <strong>“{query.trim()}”</strong></>}
              </p>
              <label className="explore-sort">
                <span>SORT</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort results">
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>

            {total === 0 ? (
              <EmptyState
                title="No results found"
                message="Try a different search term, or clear your filters to see everything."
                actionLabel="Reset filters →"
                onAction={resetAll}
              />
            ) : (
              <>
                {makers.length > 0 && (
                  <section aria-label="Makers">
                    <h2 className="explore-section-title">Makers <span>({makers.length})</span></h2>
                    <div className="explore-grid">
                      {makers.map((m, i) => (
                        <EntrepreneurCard key={m.id} entrepreneur={m} index={i} />
                      ))}
                    </div>
                  </section>
                )}
                {products.length > 0 && (
                  <section aria-label="Marketplace">
                    <h2 className="explore-section-title">Marketplace <span>({products.length})</span></h2>
                    <div className="explore-grid">
                      {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
