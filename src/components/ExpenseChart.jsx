import { groupExpensesByCategory, CATEGORY_COLORS } from '../utils.js'
import { usePreferences } from '../context/PreferencesContext.jsx'
import EmptyState from './EmptyState.jsx'

export default function ExpenseChart({ expenses = [] }) {
  const { formatMoney } = usePreferences()

  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        title="Nothing to chart yet"
        message="Add an expense transaction and your category breakdown will appear here."
      />
    )
  }

  const grouped = groupExpensesByCategory(expenses)
  const total = Object.values(grouped).reduce((sum, val) => sum + val, 0)

  const categories = Object.keys(grouped)
    .map((category) => ({
      category,
      amount: grouped[category],
      percent: total > 0 ? (grouped[category] / total) * 100 : 0,
      color: CATEGORY_COLORS[category] || '#9CA3AF',
    }))
    .sort((a, b) => b.amount - a.amount)

  // Build conic-gradient segments
  let cursor = 0
  const segments = categories.map(({ color, percent }) => {
    const start = cursor
    cursor += percent
    return `${color} ${start}% ${cursor}%`
  })
  const gradient = `conic-gradient(${segments.join(', ')})`

  return (
    <div className="chart-wrap">
      <div className="donut-chart" style={{ background: gradient }}>
        <div className="donut-hole">
          <span className="text-muted">Total Spent</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>

      <ul className="chart-legend">
        {categories.map((item) => (
          <li key={item.category}>
            <span className="legend-dot" style={{ background: item.color }}></span>
            <span className="legend-label">{item.category}</span>
            <span className="legend-value">{formatMoney(item.amount)}</span>
            <span className="legend-percent text-muted">{Math.round(item.percent)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
