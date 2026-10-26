import { useState } from 'react'
import { calculateProfit, calculateProfitPercentage } from '../utils.js'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function InvestmentCard({ investment, onUpdateValue, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(investment.currentValue)
  const { formatMoney } = usePreferences()

  const profit = calculateProfit(investment.invested, investment.currentValue)
  const roi = calculateProfitPercentage(investment.invested, investment.currentValue)
  const isProfit = profit >= 0

  function handleSave(e) {
    e.preventDefault()
    if (value === '' || Number.isNaN(Number(value))) return
    onUpdateValue(investment.id, Number(value))
    setEditing(false)
  }

  function handleDelete() {
    if (window.confirm(`Delete "${investment.name}"? This cannot be undone.`)) onDelete(investment.id)
  }

  return (
    <article className="investment-card">
      <div className="investment-card-top">
        <div>
          <h4>{investment.name}</h4>
          <span className="investment-type">{investment.type}</span>
        </div>
        <div className="investment-card-top-actions">
          <span className={`profit-pill ${isProfit ? 'profit-positive' : 'profit-negative'}`}>
            {isProfit ? '+' : ''}
            {formatMoney(profit)} ({roi > 0 ? `+${roi}%` : `${roi}%`})
          </span>
          <button className="delete-btn" aria-label={`Delete ${investment.name}`} onClick={handleDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="investment-stats">
        <div>
          <span className="text-muted">Invested</span>
          <p>{formatMoney(investment.invested)}</p>
        </div>
        <div>
          <span className="text-muted">Current Value</span>
          {editing ? (
            <form className="inline-add-form" onSubmit={handleSave}>
              <input
                type="number"
                min="0"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <p className="font-semibold">{formatMoney(investment.currentValue)}</p>
          )}
        </div>
      </div>

      {!editing && (
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
          Update value
        </button>
      )}
    </article>
  )
}
