export default function SummaryCard({ label, value, icon, glow, tone }) {
  return (
    <article className={`summary-card ${glow ? 'summary-card-glow' : ''}`}>
      <div className="summary-card-top">
        <span className="summary-card-label">{label}</span>
        <span className={`summary-card-icon ${tone ? `icon-${tone}` : ''}`}>{icon}</span>
      </div>
      <p className={`summary-card-value ${tone ? `text-${tone}` : ''}`}>{value}</p>
    </article>
  )
}
