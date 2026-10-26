export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19h16M6 19V9l6-4 6 4v10M10 19v-6h4v6" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button className="btn btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
