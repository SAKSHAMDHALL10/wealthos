import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadData, saveData, generateId, DEFAULT_DEMO_DATA } from '../utils.js'

function getInitialInvestments() {
  const stored = loadData(STORAGE_KEYS.INVESTMENTS, null)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  saveData(STORAGE_KEYS.INVESTMENTS, DEFAULT_DEMO_DATA.investments)
  return DEFAULT_DEMO_DATA.investments
}

const initialState = {
  items: getInitialInvestments(),
}

export const investmentsSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {
    addInvestment: (state, action) => {
      const record = {
        id: generateId(),
        ...action.payload,
        invested: Number(action.payload.invested) || 0,
        currentValue: Number(action.payload.currentValue) || 0,
      }
      state.items.push(record)
      saveData(STORAGE_KEYS.INVESTMENTS, state.items)
    },
    updateInvestmentValue: (state, action) => {
      const { id, newValue } = action.payload
      const inv = state.items.find((item) => item.id === id)
      if (inv) {
        inv.currentValue = Number(newValue) || 0
        saveData(STORAGE_KEYS.INVESTMENTS, state.items)
      }
    },
    deleteInvestment: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveData(STORAGE_KEYS.INVESTMENTS, state.items)
    },
    resetInvestmentsToDemo: (state) => {
      state.items = DEFAULT_DEMO_DATA.investments
      saveData(STORAGE_KEYS.INVESTMENTS, state.items)
    },
  },
})

export const {
  addInvestment,
  updateInvestmentValue,
  deleteInvestment,
  resetInvestmentsToDemo,
} = investmentsSlice.actions

export const selectAllInvestments = (state) => state.investments.items

export const selectTotalInvested = (state) =>
  state.investments.items.reduce((sum, item) => sum + Number(item.invested || 0), 0)

export const selectTotalCurrentValue = (state) =>
  state.investments.items.reduce((sum, item) => sum + Number(item.currentValue || 0), 0)

export const selectTotalInvestmentProfit = (state) =>
  selectTotalCurrentValue(state) - selectTotalInvested(state)

export default investmentsSlice.reducer

