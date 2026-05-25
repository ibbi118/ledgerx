/**
 * Spinner — centered animated loading spinner
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };
  return (
    <div
      className={`${sizes[size]} border-2 border-gray-200 border-t-accent rounded-full animate-spin ${className}`}
    />
  );
};

/**
 * PageLoader — full-page centered spinner
 */
export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

/**
 * SkeletonLine — a single skeleton placeholder
 */
export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded ${className}`} />
);

/**
 * CardSkeleton — skeleton for a stat card
 */
export const CardSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 shadow-card">
    <div className="skeleton h-3 w-24 rounded mb-4" />
    <div className="skeleton h-7 w-32 rounded mb-2" />
    <div className="skeleton h-3 w-16 rounded" />
  </div>
);

/**
 * TableSkeleton — skeleton for a data table
 */
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <div className="skeleton h-5 flex-1 rounded" />
        <div className="skeleton h-5 w-28 rounded" />
        <div className="skeleton h-5 w-20 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
      </div>
    ))}
  </div>
);

export default Spinner;
