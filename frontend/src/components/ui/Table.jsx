/**
 * Table — reusable, responsive data table with overflow scroll.
 */
const Table = ({ columns, data, emptyMessage = 'No data found', loading = false }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-surface border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {loading ? (
            // Loading rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data?.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row._id || row.id || rowIdx}
                className="hover:bg-surface/60 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 text-primary ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
