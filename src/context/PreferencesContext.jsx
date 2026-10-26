import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS, loadData, saveData, formatCurrency, THEME_ACCENTS, CURRENCIES } from '../utils.js'

// Create Context for Application Preferences (Demonstrating React Context API)
export const PreferencesContext = createContext(null)

const DEFAULT_PREFERENCES = {
  currency: 'INR',
  themeAccent: 'emerald',
  dateFormat: 'DD/MM/YYYY',
  showTips: true,
}

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    return loadData(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES)
  })

  // Synchronize preferences to localStorage whenever state updates
  useEffect(() => {
    saveData(STORAGE_KEYS.PREFERENCES, preferences)
    
    // Dynamically update document accent color tokens based on selected theme
    const accent = THEME_ACCENTS[preferences.themeAccent] || THEME_ACCENTS.emerald
    const root = document.documentElement
    root.style.setProperty('--emerald', accent.color)
    
    // Generate soft glow matching the selected accent color
    const hex = accent.color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    root.style.setProperty('--emerald-glow', `rgba(${r}, ${g}, ${b}, 0.22)`)
  }, [preferences])

  // Context Actions: Predictable state mutators
  const setCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setPreferences((prev) => ({ ...prev, currency: currencyCode }))
    }
  }

  const setThemeAccent = (themeKey) => {
    if (THEME_ACCENTS[themeKey]) {
      setPreferences((prev) => ({ ...prev, themeAccent: themeKey }))
    }
  }

  const toggleTips = () => {
    setPreferences((prev) => ({ ...prev, showTips: !prev.showTips }))
  }

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES)
  }

  // Convenient formatting helper using current preference
  const formatMoney = (amount) => {
    return formatCurrency(amount, preferences.currency)
  }

  const currentCurrency = CURRENCIES[preferences.currency] || CURRENCIES.INR

  const contextValue = {
    preferences,
    currency: preferences.currency,
    currencySymbol: currentCurrency.symbol,
    currentCurrency,
    themeAccent: preferences.themeAccent,
    showTips: preferences.showTips,
    setCurrency,
    setThemeAccent,
    toggleTips,
    resetPreferences,
    formatMoney,
  }

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  )
}

// Custom hook to consume PreferencesContext cleanly with validation
export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}

