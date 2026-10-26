import { useState } from 'react'
import { formatDate, calculateGoalProgress } from '../utils.js'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function GoalCard({ goal, onAddFunds, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [amount, setAmount] = useState('')
  const { formatMoney } = usePreferences()

  const progress = calculateGoalProgress(goal.saved, goal.target)
  const isComplete = progress >= 100

  function handleAddFunds(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    onAddFunds(goal.id, value)
    setAmount('')
    setAdding(false)
  }

  function handleDelete() {
    if (window.confirm(`Delete goal "${goal.name}"? This cannot be undone.`)) onDelete(goal.id)
  }

  return (
    <article className="goal-card">
      <div className="goal-card-top">
        <h4>{goal.name}</h4>
        <div className="goal-card-top-actions">
          {isComplete && <span className="goal-badge">Achieved</span>}
          <button className="delete-btn" aria-label={`Delete ${goal.name}`} onClick={handleDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          </button>
        </div>
      </div>

      <p className="goal-amounts">
        <span className="text-emerald">{formatMoney(goal.saved)}</span>
        <span className="text-muted"> / {formatMoney(goal.target)}</span>
      </p>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="goal-meta">
        <span>{progress}% complete</span>
        <span>Target: {formatDate(goal.date)}</span>
      </div>

      {adding ? (
        <form className="inline-add-form" onSubmit={handleAddFunds}>
          <input
            type="number"
            min="1"
            autoFocus
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Add
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button className="btn btn-secondary btn-sm" onClick={() => setAdding(true)}>
          + Add funds
        </button>
      )}
    </article>
  )
}
