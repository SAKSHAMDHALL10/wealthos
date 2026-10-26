import { useState } from 'react'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function BudgetCard({ budget, spent = 0, onEdit, onDelete }) {
  const { formatMoney } = usePreferences()
  const [isEditing, setIsEditing] = useState(false)
  const [newLimit, setNewLimit] = useState(budget.monthlyLimit)

  const percent = budget.monthlyLimit > 0 ? Math.round((spent / budget.monthlyLimit) * 100) : 0
  const remaining = budget.monthlyLimit - spent
  const isOver = percent >= 100
  const isWarning = percent >= 80 && percent < 100

  function handleSave(e) {
    e.preventDefault()
    if (!newLimit || Number(newLimit) <= 0) return
    onEdit(budget.category, Number(newLimit))
    setIsEditing(false)
  }

  return (
    <article className={`budget-card panel ${isOver ? 'budget-exceeded' : ''}`}>
      <div className="budget-card-header">
        <div>
          <h4>{budget.category}</h4>
          <span className="text-muted text-sm">Monthly Budget</span>
        </div>
        <div className="budget-badges">
          {isOver ? (
            <span className="badge badge-danger">Exceeded by {formatMoney(Math.abs(remaining))}</span>
          ) : isWarning ? (
            <span className="badge badge-warning">Near Limit ({percent}%)</span>
          ) : (
            <span className="badge badge-success">{percent}% spent</span>
          )}

          {onDelete && (
            <button
              className="delete-btn"
              aria-label={`Delete budget for ${budget.category}`}
              onClick={() => {
                if (window.confirm(`Delete budget for ${budget.category}?`)) onDelete(budget.id)
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="budget-amounts">
        <div>
          <span className="text-muted text-xs">Spent</span>
          <p className="budget-spent-amount">{formatMoney(spent)}</p>
        </div>
        <div className="text-right">
          <span className="text-muted text-xs">Limit</span>
          <p className="budget-limit-amount">{formatMoney(budget.monthlyLimit)}</p>
        </div>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${isOver ? 'progress-fill-danger' : isWarning ? 'progress-fill-warning' : ''}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        ></div>
      </div>

      <div className="budget-card-footer">
        <span className="text-muted text-sm">
          {remaining >= 0 ? `${formatMoney(remaining)} remaining` : `Over budget by ${formatMoney(Math.abs(remaining))}`}
        </span>

        {isEditing ? (
          <form onSubmit={handleSave} className="inline-add-form">
            <input
              type="number"
              min="1"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="budget-inline-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-xs">
              Save
            </button>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <button className="link-button text-sm" onClick={() => setIsEditing(true)}>
            Edit limit
          </button>
        )}
      </div>
    </article>
  )
}

