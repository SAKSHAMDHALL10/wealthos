import { createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadData, saveData, generateId, DEFAULT_DEMO_DATA } from '../utils.js'

function getInitialGoals() {
  const stored = loadData(STORAGE_KEYS.GOALS, null)
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored
  }
  saveData(STORAGE_KEYS.GOALS, DEFAULT_DEMO_DATA.goals)
  return DEFAULT_DEMO_DATA.goals
}

const initialState = {
  items: getInitialGoals(),
}

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      const record = {
        id: generateId(),
        saved: 0,
        ...action.payload,
        target: Number(action.payload.target) || 0,
      }
      state.items.push(record)
      saveData(STORAGE_KEYS.GOALS, state.items)
    },
    updateGoalSaved: (state, action) => {
      const { id, amountToAdd } = action.payload
      const goal = state.items.find((g) => g.id === id)
      if (goal) {
        goal.saved = Number(goal.saved || 0) + Number(amountToAdd || 0)
        saveData(STORAGE_KEYS.GOALS, state.items)
      }
    },
    deleteGoal: (state, action) => {
      state.items = state.items.filter((g) => g.id !== action.payload)
      saveData(STORAGE_KEYS.GOALS, state.items)
    },
    resetGoalsToDemo: (state) => {
      state.items = DEFAULT_DEMO_DATA.goals
      saveData(STORAGE_KEYS.GOALS, state.items)
    },
  },
})

export const { addGoal, updateGoalSaved, deleteGoal, resetGoalsToDemo } = goalsSlice.actions

export const selectAllGoals = (state) => state.goals.items

export default goalsSlice.reducer

