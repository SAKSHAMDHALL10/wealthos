import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { CURRENCIES, THEME_ACCENTS, validateForm, saveData, STORAGE_KEYS, DEFAULT_DEMO_DATA } from '../utils.js'
import { resetTransactionsToDemo } from '../store/transactionsSlice.js'
import { resetBudgetsToDemo } from '../store/budgetsSlice.js'
import { resetGoalsToDemo } from '../store/goalsSlice.js'
import { resetInvestmentsToDemo } from '../store/investmentsSlice.js'

export default function SettingsPage() {
  const dispatch = useDispatch()
  const { user, updateProfile } = useAuth()
  const { showToast } = useOutletContext()
  const { currency, setCurrency, themeAccent, setThemeAccent } = usePreferences()

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [profileErrors, setProfileErrors] = useState({})

  function handleProfileChange(e) {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleProfileSubmit(e) {
    e.preventDefault()
    const errors = validateForm(profileForm)
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      return
    }

    updateProfile(profileForm)
    showToast('Profile information updated!')
  }

  function handleResetDemoData() {
    if (
      window.confirm(
        'Reset all transactions, budgets, goals, and investments to the demo viva dataset?'
      )
    ) {
      dispatch(resetTransactionsToDemo())
      dispatch(resetBudgetsToDemo())
      dispatch(resetGoalsToDemo())
      dispatch(resetInvestmentsToDemo())
      saveData(STORAGE_KEYS.TRANSACTIONS, DEFAULT_DEMO_DATA.transactions)
      saveData(STORAGE_KEYS.BUDGETS, DEFAULT_DEMO_DATA.budgets)
      saveData(STORAGE_KEYS.GOALS, DEFAULT_DEMO_DATA.goals)
      saveData(STORAGE_KEYS.INVESTMENTS, DEFAULT_DEMO_DATA.investments)
      showToast('Application restored to rich demo dataset!')
    }
  }

  function handleClearAllData() {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This will empty all transactions and reset your ledger.'
      )
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="settings-page">
      {/* React Context API: Application Preferences */}
      <section className="panel mb-4">
        <div className="panel-header">
          <div>
            <h3>Preferences (React Context API)</h3>
            <p className="text-muted text-sm">
              Global application state distributed via <code>PreferencesContext</code>
            </p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="settings-field">
            <label htmlFor="pref-currency">Default Currency</label>
            <p className="text-muted text-xs mb-1">
              Controls currency format and symbol globally across all balances, charts, and tables.
            </p>
            <select
              id="pref-currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value)
                showToast(`Currency changed to ${e.target.value}!`)
              }}
              className="select-custom"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="pref-theme">Theme Accent Color</label>
            <p className="text-muted text-xs mb-1">
              Modifies CSS root tokens and glow effects dynamically in real-time.
            </p>
            <div className="theme-selector">
              {Object.keys(THEME_ACCENTS).map((key) => {
                const item = THEME_ACCENTS[key]
                const isSelected = themeAccent === key
                return (
                  <button
                    key={key}
                    type="button"
                    className={`theme-badge-btn ${isSelected ? 'theme-badge-selected' : ''}`}
                    onClick={() => {
                      setThemeAccent(key)
                      showToast(`Accent updated to ${item.label}!`)
                    }}
                  >
                    <span className="theme-color-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* React Controlled Form: Profile */}
      <section className="panel mb-4">
        <div className="panel-header">
          <div>
            <h3>Account Profile</h3>
            <p className="text-muted text-sm">
              Demonstrates controlled form handling with validation and submit feedback
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} noValidate className="max-w-md">
          <div className="field-group">
            <label htmlFor="prof-name">Full Name *</label>
            <input
              id="prof-name"
              name="name"
              type="text"
              value={profileForm.name}
              onChange={handleProfileChange}
              className={profileErrors.name ? 'input-error' : ''}
            />
            {profileErrors.name && <span className="form-error">{profileErrors.name}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="prof-email">Email Address *</label>
            <input
              id="prof-email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className={profileErrors.email ? 'input-error' : ''}
            />
            {profileErrors.email && <span className="form-error">{profileErrors.email}</span>}
          </div>

          <button type="submit" className="btn btn-primary">
            Save Profile Changes
          </button>
        </form>
      </section>

      {/* University Project / Viva Demonstration Controls */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Viva Demo & Data Management</h3>
            <p className="text-muted text-sm">
              Frontend Engineering-II Evaluation utility controls
            </p>
          </div>
        </div>

        <div className="viva-controls">
          <div className="viva-box">
            <h4>Quick Demo Data Reset</h4>
            <p className="text-muted text-xs mb-2">
              Populates realistic Chitkara University student financial records, active budgets,
              goals, and investment assets across Redux Toolkit stores.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={handleResetDemoData}>
              ⚡ Reset to Rich Demo Dataset
            </button>
          </div>

          <div className="viva-box mt-3">
            <h4>Purge Browser LocalStorage</h4>
            <p className="text-muted text-xs mb-2">
              Removes all cached browser records to test first-run behavior and empty states.
            </p>
            <button className="btn btn-ghost btn-sm text-red" onClick={handleClearAllData}>
              Clear All Data
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

