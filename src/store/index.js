import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from './transactionsSlice.js'
import budgetsReducer from './budgetsSlice.js'
import goalsReducer from './goalsSlice.js'
import investmentsReducer from './investmentsSlice.js'

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    goals: goalsReducer,
    investments: investmentsReducer,
  },
})

export default store

