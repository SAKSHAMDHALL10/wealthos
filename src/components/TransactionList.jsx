import { useState } from 'react'
import { formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils.js'
import { usePreferences } from '../context/PreferencesContext.jsx'
import EmptyState from './EmptyState.jsx'

export default function TransactionList({
  transactions = [],
  limit,
  showFilters = false,
  showSearch = false,
  onAddFirst,
  onEdit,
  onDelete,
}) {
  const { formatMoney } = usePreferences()
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        message="Start tracking your finances by adding your first transaction."
        actionLabel={onAddFirst ? 'Add Transaction' : null}
        onAction={onAddFirst}
      />
    )
  }

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    // Type tab
    if (filter === 'income' && tx.type !== 'income') return false
    if (filter === 'expense' && tx.type !== 'expense') return false

    // Category
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      const title = (tx.title || tx.name || tx.source || '').toLowerCase()
      const category = (tx.category || '').toLowerCase()
      const notes = (tx.notes || '').toLowerCase()
      if (!title.includes(q) && !category.includes(q) && !notes.includes(q)) {
        return false
      }
    }

    return true
  })

  const visible = limit ? filtered.slice(0, limit) : filtered

  const allCategories = ['all', ...Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]))]

  return (
    <div className="transaction-container">
      {(showFilters || showSearch) && (
        <div className="transaction-controls">
          {showSearch && (
            <div className="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions by title or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>
                  ×
                </button>
              )}
            </div>
          )}

          <div className="filter-row">
            {showFilters && (
              <div className="filter-tabs">
                {['all', 'income', 'expense'].map((key) => (
                  <button
                    key={key}
                    className={`filter-tab ${filter === key ? 'filter-tab-active' : ''}`}
                    onClick={() => setFilter(key)}
                  >
                    {key === 'all' ? 'All' : key === 'income' ? 'Income' : 'Expenses'}
                  </button>
                ))}
              </div>
            )}

            {showFilters && (
              <select
                className="category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {allCategories
                  .filter((cat) => cat !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty-filter-state">
          <p className="text-muted">No transactions match your search or filter criteria.</p>
        </div>
      ) : (
        <ul className="transaction-list">
          {visible.map((tx) => {
            const label = tx.title || tx.name || tx.source || 'Transaction'
            const isIncome = tx.type === 'income'
            return (
              <li key={`${tx.type}-${tx.id}`} className="transaction-item">
                <div className={`transaction-indicator ${isIncome ? 'indicator-income' : 'indicator-expense'}`}>
                  {isIncome ? '↓' : '↑'}
                </div>

                <div className="transaction-info">
                  <p className="transaction-name">{label}</p>
                  <p className="transaction-meta">
                    <span className="tx-category-badge">{tx.category}</span>
                    <span>·</span>
                    <span>{formatDate(tx.date)}</span>
                    {tx.notes && (
                      <>
                        <span>·</span>
                        <span className="tx-notes">{tx.notes}</span>
                      </>
                    )}
                  </p>
                </div>

                <p className={`transaction-amount ${isIncome ? 'text-emerald' : 'text-red'}`}>
                  {isIncome ? '+' : '-'}
                  {formatMoney(tx.amount)}
                </p>

                {(onEdit || onDelete) && (
                  <div className="transaction-actions">
                    {onEdit && (
                      <button className="edit-btn" aria-label={`Edit ${label}`} onClick={() => onEdit(tx)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="delete-btn"
                        aria-label={`Delete ${label}`}
                        onClick={() => {
                          if (window.confirm(`Delete "${label}"? This cannot be undone.`)) onDelete(tx.id)
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
