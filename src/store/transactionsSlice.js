import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadData, saveData, generateId, DEFAULT_DEMO_DATA } from '../utils.js'

function getInitialTransactions() {
  const stored = loadData(STORAGE_KEYS.TRANSACTIONS, null)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }

  // Check legacy split storage (income & expenses) for seamless backward compatibility
  const legacyIncome = loadData(STORAGE_KEYS.INCOME, [])
  const legacyExpenses = loadData(STORAGE_KEYS.EXPENSES, [])
  if (legacyIncome.length > 0 || legacyExpenses.length > 0) {
    const migrated = [
      ...legacyIncome.map((i) => ({ ...i, type: 'income', title: i.source || i.name })),
      ...legacyExpenses.map((e) => ({ ...e, type: 'expense', title: e.name || e.source })),
    ]
    saveData(STORAGE_KEYS.TRANSACTIONS, migrated)
    return migrated
  }

  // Fallback to rich demo data
  saveData(STORAGE_KEYS.TRANSACTIONS, DEFAULT_DEMO_DATA.transactions)
  return DEFAULT_DEMO_DATA.transactions
}

const initialState = {
  items: getInitialTransactions(),
  filter: 'all', // 'all' | 'income' | 'expense'
  categoryFilter: 'all',
  searchQuery: '',
}

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const record = {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        ...action.payload,
        amount: Number(action.payload.amount) || 0,
      }
      // Put newer transactions at the front
      state.items.unshift(record)
      saveData(STORAGE_KEYS.TRANSACTIONS, state.items)
    },
    updateTransaction: (state, action) => {
      const { id, ...updatedFields } = action.payload
      const index = state.items.findIndex((item) => item.id === id)
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updatedFields,
          amount: Number(updatedFields.amount !== undefined ? updatedFields.amount : state.items[index].amount) || 0,
        }
        saveData(STORAGE_KEYS.TRANSACTIONS, state.items)
      }
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveData(STORAGE_KEYS.TRANSACTIONS, state.items)
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    resetTransactionsToDemo: (state) => {
      state.items = DEFAULT_DEMO_DATA.transactions
      state.filter = 'all'
      state.categoryFilter = 'all'
      state.searchQuery = ''
      saveData(STORAGE_KEYS.TRANSACTIONS, state.items)
    },
  },
})

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilter,
  setCategoryFilter,
  setSearchQuery,
  resetTransactionsToDemo,
} = transactionsSlice.actions

// Selectors for Redux state consumption
export const selectAllTransactions = (state) => state.transactions.items
export const selectFilter = (state) => state.transactions.filter
export const selectCategoryFilter = (state) => state.transactions.categoryFilter
export const selectSearchQuery = (state) => state.transactions.searchQuery

export const selectFilteredTransactions = (state) => {
  const { items, filter, categoryFilter, searchQuery } = state.transactions
  return items.filter((tx) => {
    // Type filter
    if (filter === 'income' && tx.type !== 'income') return false
    if (filter === 'expense' && tx.type !== 'expense') return false

    // Category filter
    if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false

    // Search query filter (matches title, notes, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = (tx.title || tx.name || tx.source || '').toLowerCase().includes(q)
      const catMatch = (tx.category || '').toLowerCase().includes(q)
      const notesMatch = (tx.notes || '').toLowerCase().includes(q)
      if (!titleMatch && !catMatch && !notesMatch) return false
    }

    return true
  })
}

export const selectTotalIncome = (state) =>
  state.transactions.items
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

export const selectTotalExpenses = (state) =>
  state.transactions.items
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

export const selectBalance = (state) => {
  const income = selectTotalIncome(state)
  const expenses = selectTotalExpenses(state)
  return income - expenses
}

export const selectExpensesByCategory = (state) => {
  const expenses = state.transactions.items.filter((tx) => tx.type === 'expense')
  return expenses.reduce((groups, expense) => {
    const key = expense.category || 'Other'
    groups[key] = (groups[key] || 0) + Number(expense.amount || 0)
    return groups
  }, {})
}

export default transactionsSlice.reducer

