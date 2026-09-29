import './FilterPanel.css';

/**
 * Controlled filter panel for the Explore page.
 * filters: { category, location, minPrice, maxPrice, minRating, availableOnly, type }
 * onChange(patch), onReset()
 */
export default function FilterPanel({ filters, onChange, onReset, categories, locations, resultCount }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const activeCount = [
    filters.category !== 'all',
    filters.location !== 'all',
    filters.minPrice !== '' || filters.maxPrice !== '',
    filters.minRating > 0,
    filters.availableOnly,
    filters.type !== 'all',
  ].filter(Boolean).length;

  return (
    <aside className="filter-panel" aria-label="Filters">
      <div className="filter-panel-head">
        <p className="filter-panel-title">
          FILTERS {activeCount > 0 && <span className="filter-count">({activeCount})</span>}
        </p>
        {activeCount > 0 && (
          <button type="button" className="filter-reset" onClick={onReset}>
            Reset all
          </button>
        )}
      </div>

      <div className="filter-group">
        <p className="filter-group-label" id="flt-type">Show</p>
        <div className="filter-segmented" role="group" aria-labelledby="flt-type">
          {[
            { v: 'all', l: 'All' },
            { v: 'makers', l: 'Makers' },
            { v: 'products', l: 'Products' },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              className={`filter-chip${filters.type === o.v ? ' is-active' : ''}`}
              aria-pressed={filters.type === o.v}
              onClick={() => set({ type: o.v })}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-group-label" htmlFor="flt-category">Craft</label>
        <select id="flt-category" value={filters.category} onChange={(e) => set({ category: e.target.value })}>
          <option value="all">All crafts</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-group-label" htmlFor="flt-location">Location</label>
        <select id="flt-location" value={filters.location} onChange={(e) => set({ location: e.target.value })}>
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <p className="filter-group-label" id="flt-price">Price range (₹)</p>
        <div className="filter-price-row" role="group" aria-labelledby="flt-price">
          <input
            type="number" min="0" placeholder="Min" aria-label="Minimum price"
            value={filters.minPrice} onChange={(e) => set({ minPrice: e.target.value })}
          />
          <span aria-hidden="true">—</span>
          <input
            type="number" min="0" placeholder="Max" aria-label="Maximum price"
            value={filters.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-group-label" id="flt-rating">Minimum rating</p>
        <div className="filter-segmented" role="group" aria-labelledby="flt-rating">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              className={`filter-chip${filters.minRating === r ? ' is-active' : ''}`}
              aria-pressed={filters.minRating === r}
              onClick={() => set({ minRating: r })}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => set({ availableOnly: e.target.checked })}
          />
          <span>Available makers only</span>
        </label>
      </div>

      {typeof resultCount === 'number' && (
        <p className="filter-results" aria-live="polite">
          {resultCount} result{resultCount === 1 ? '' : 's'}
        </p>
      )}
    </aside>
  );
}
