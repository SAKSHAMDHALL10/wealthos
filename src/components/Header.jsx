import { Link } from 'react-router-dom'
import { getGreeting } from '../utils.js'
import { useAuth } from '../context/AuthContext.jsx'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function Header({ onMenuClick, onQuickAdd }) {
  const { user } = useAuth()
  const { currentCurrency } = usePreferences()

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SD'

  return (
    <header className="dashboard-header">
      <button className="menu-toggle" onClick={onMenuClick} aria-label="Open navigation menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className="header-text">
        <h1>
          {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p>Smart personal wealth and cashflow overview</p>
      </div>

      <div className="header-actions">
        {onQuickAdd && (
          <button className="btn btn-primary btn-sm header-add-btn" onClick={onQuickAdd}>
            + Add Transaction
          </button>
        )}

        <Link to="/settings" className="currency-pill" title="Click to change currency in Settings">
          <span className="currency-symbol">{currentCurrency.symbol}</span>
          <span className="currency-code">{currentCurrency.code}</span>
        </Link>

        <Link to="/settings" className="header-profile" title="View Profile & Settings">
          <div className="avatar">{initials}</div>
        </Link>
      </div>
    </header>
  )
}
