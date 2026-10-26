import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS, loadData, saveData, DEFAULT_DEMO_DATA } from '../utils.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return loadData(STORAGE_KEYS.SESSION, false)
  })

  const [user, setUser] = useState(() => {
    const stored = loadData(STORAGE_KEYS.USER, null)
    // If no user exists, load the student demo profile so viva is instantly demonstrable
    if (!stored) {
      saveData(STORAGE_KEYS.USER, DEFAULT_DEMO_DATA.user)
      return DEFAULT_DEMO_DATA.user
    }
    return stored
  })

  useEffect(() => {
    saveData(STORAGE_KEYS.SESSION, isAuthenticated)
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      saveData(STORAGE_KEYS.USER, user)
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const signup = (newUserData) => {
    setUser(newUserData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const updateProfile = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }))
  }

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

