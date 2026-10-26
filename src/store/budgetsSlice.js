import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadData, saveData, generateId, DEFAULT_DEMO_DATA } from '../utils.js'

function getInitialBudgets() {
  const stored = loadData(STORAGE_KEYS.BUDGETS, null)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  saveData(STORAGE_KEYS.BUDGETS, DEFAULT_DEMO_DATA.budgets)
  return DEFAULT_DEMO_DATA.budgets
}

const initialState = {
  items: getInitialBudgets(),
}

export const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudget: (state, action) => {
      const { category, monthlyLimit } = action.payload
      const existingIndex = state.items.findIndex(
        (b) => b.category.toLowerCase() === category.toLowerCase()
      )

      if (existingIndex !== -1) {
        state.items[existingIndex].monthlyLimit = Number(monthlyLimit)
      } else {
        state.items.push({
          id: generateId(),
          category,
          monthlyLimit: Number(monthlyLimit),
        })
      }
      saveData(STORAGE_KEYS.BUDGETS, state.items)
    },
    deleteBudget: (state, action) => {
      state.items = state.items.filter((b) => b.id !== action.payload)
      saveData(STORAGE_KEYS.BUDGETS, state.items)
    },
    resetBudgetsToDemo: (state) => {
      state.items = DEFAULT_DEMO_DATA.budgets
      saveData(STORAGE_KEYS.BUDGETS, state.items)
    },
  },
})

export const { setBudget, deleteBudget, resetBudgetsToDemo } = budgetsSlice.actions

export const selectAllBudgets = (state) => state.budgets.items

export default budgetsSlice.reducer

