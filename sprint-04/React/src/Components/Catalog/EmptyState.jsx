export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state" role="status">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="empty-icon">
        <path d="M8 38c8-10 16-10 24 0s16 10 24 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 26c8-10 16-10 24 0s16 10 24 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".45" />
      </svg>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
