import './DataTable.css';

/**
 * Dense, sharp admin table.
 * columns: [{ key, label, render?(row), sortable? }]
 * Horizontal scroll on small screens via wrapper.
 */
export default function DataTable({ columns, rows, rowKey = 'id', emptyTitle = 'No records', emptyMessage }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="datatable-empty" role="status">
        <p className="datatable-empty-title">{emptyTitle}</p>
        {emptyMessage && <p className="datatable-empty-message">{emptyMessage}</p>}
      </div>
    );
  }
  return (
    <div className="datatable-wrap" role="region" aria-label="Data table" tabIndex={0}>
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
