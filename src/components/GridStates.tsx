import '../styles/skeleton.css';

export function GridSkeleton() {
  return (
    <div className="grid-skeleton" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
      <div className="skeleton-header">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-header-cell"></div>
        ))}
      </div>
      <div className="skeleton-body">
        {Array.from({ length: 10 }).map((_, rowIdx) => (
          <div key={rowIdx} className="skeleton-row">
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <div key={colIdx} className="skeleton-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ message = 'No data found' }: { message?: string }) {
  return (
    <div className="empty-state" role="status" aria-label="No data">
      <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00 5.414 13H3" />
      </svg>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <svg className="error-state-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <p className="error-state-message">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-state-retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
}
