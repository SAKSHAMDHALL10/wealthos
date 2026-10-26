// ---------------------------------------------------------
// utils.js — plain vanilla JavaScript helpers used by React
// components. No React here: pure functions, arrays, objects,
// template literals, localStorage + JSON.
// ---------------------------------------------------------

// Keys under which each slice of data lives in localStorage
export const STORAGE_KEYS = {
  USER: 'wealthos_user',
  SESSION: 'wealthos_session',
  TRANSACTIONS: 'wealthos_transactions',
  INCOME: 'wealthos_income',
  EXPENSES: 'wealthos_expenses',
  BUDGETS: 'wealthos_budgets',
  GOALS: 'wealthos_goals',
  INVESTMENTS: 'wealthos_investments',
  PREFERENCES: 'wealthos_preferences',
}

// Supported currencies with their locale, symbols, and real-time exchange rates from base INR
export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)', locale: 'en-IN', rateFromINR: 1 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar ($)', locale: 'en-US', rateFromINR: 1 / 85.0 }, // 1 USD ≈ ₹85
  EUR: { code: 'EUR', symbol: '€', label: 'Euro (€)', locale: 'de-DE', rateFromINR: 1 / 92.0 }, // 1 EUR ≈ ₹92
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound (£)', locale: 'en-GB', rateFromINR: 1 / 110.0 }, // 1 GBP ≈ ₹110
}

// Theme accent options
export const THEME_ACCENTS = {
  emerald: { label: 'Emerald Green', color: '#10b981' },
  cyan: { label: 'Electric Cyan', color: '#06b6d4' },
  violet: { label: 'Neon Violet', color: '#8b5cf6' },
  amber: { label: 'Golden Amber', color: '#f59e0b' },
}

// Fixed category lists (kept here so every form/chart uses the same source)
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investments', 'Other']
export const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Other']
export const INVESTMENT_TYPES = ['Stocks', 'Mutual Funds', 'Fixed Deposit', 'Crypto', 'Real Estate', 'Other']

// Colour used per expense category in the chart
export const CATEGORY_COLORS = {
  Food: '#10B981',
  Bills: '#34D399',
  Shopping: '#6EE7B7',
  Transport: '#38BDF8',
  Entertainment: '#A78BFA',
  Other: '#9CA3AF',
}

/** Format a number using selected currency with accurate currency exchange from base INR */
export function formatCurrency(amount, currencyCode = 'INR') {
  const conf = CURRENCIES[currencyCode] || CURRENCIES.INR
  const baseNum = Number(amount) || 0
  const converted = baseNum * (conf.rateFromINR || 1)

  return new Intl.NumberFormat(conf.locale, {
    style: 'currency',
    currency: conf.code,
    maximumFractionDigits: conf.code === 'INR' ? 0 : 0,
  }).format(Math.round(converted))
}

/** Format an ISO date string as "23 Aug 2026" */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Returns "Good morning" / "Good afternoon" / "Good evening" based on clock */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Sum an array of {amount} objects with reduce() */
export function sumAmounts(items = []) {
  return items.reduce((total, item) => total + Number(item.amount || 0), 0)
}

/** balance = totalIncome - totalExpenses */
export function calculateBalance(income = [], expenses = []) {
  return sumAmounts(income) - sumAmounts(expenses)
}

/** Calculate savings rate = ((Income - Expenses) / Income) * 100 */
export function calculateSavingsRate(totalIncome, totalExpenses) {
  if (!totalIncome || totalIncome <= 0) return 0
  const rate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
  return Math.max(0, rate)
}

/** Calculate Net Worth = Balance + Total Current Value of Investments */
export function calculateNetWorth(balance, investments = []) {
  const totalInvestments = investments.reduce((sum, inv) => sum + Number(inv.currentValue || 0), 0)
  return balance + totalInvestments
}

/** Group expenses by category and sum each group, using reduce() */
export function groupExpensesByCategory(expenses = []) {
  return expenses.reduce((groups, expense) => {
    const key = expense.category || 'Other'
    groups[key] = (groups[key] || 0) + Number(expense.amount || 0)
    return groups
  }, {})
}

/** Merge income + expenses into one transaction feed, newest first */
export function buildTransactions(income = [], expenses = []) {
  const incomeTx = income.map((item) => ({ ...item, type: 'income' }))
  const expenseTx = expenses.map((item) => ({ ...item, type: 'expense' }))
  return [...incomeTx, ...expenseTx].sort((a, b) => new Date(b.date) - new Date(a.date))
}

/** goalProgress = (savedAmount / targetAmount) * 100, capped at 100 */
export function calculateGoalProgress(saved, target) {
  if (!target || target <= 0) return 0
  return Math.min(100, Math.round((Number(saved) / Number(target)) * 100))
}

/** profit = currentValue - investedAmount */
export function calculateProfit(invested, currentValue) {
  return Number(currentValue || 0) - Number(invested || 0)
}

/** profitPercentage = ((currentValue - invested) / invested) * 100 */
export function calculateProfitPercentage(invested, currentValue) {
  const inv = Number(invested || 0)
  if (inv <= 0) return 0
  return Math.round(((Number(currentValue || 0) - inv) / inv) * 100)
}

/** Generate a reasonably unique id without external dependencies */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** Simple required-field and numeric validator. Returns { [field]: message } */
export function validateForm(fields) {
  const errors = {}
  Object.keys(fields).forEach((key) => {
    const value = fields[key]
    if (value === undefined || value === null || String(value).trim() === '') {
      errors[key] = 'This field is required'
    }
  })
  if (fields.amount !== undefined && Number(fields.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }
  if (fields.target !== undefined && Number(fields.target) <= 0) {
    errors.target = 'Target must be greater than zero'
  }
  if (fields.invested !== undefined && Number(fields.invested) <= 0) {
    errors.invested = 'Invested amount must be greater than zero'
  }
  if (fields.currentValue !== undefined && Number(fields.currentValue) < 0) {
    errors.currentValue = 'Current value cannot be negative'
  }
  if (fields.monthlyLimit !== undefined && Number(fields.monthlyLimit) <= 0) {
    errors.monthlyLimit = 'Budget limit must be greater than zero'
  }
  return errors
}

/** Read + JSON.parse a slice from localStorage, falling back gracefully */
export function loadData(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch (err) {
    console.error(`Could not load ${key} from localStorage`, err)
    return fallback
  }
}

/** JSON.stringify + write a slice to localStorage */
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error(`Could not save ${key} to localStorage`, err)
  }
}

/** Pre-populated rich demonstration dataset for WealthOS */
export const DEFAULT_DEMO_DATA = {
  user: {
    name: 'Saksham Dhall',
    email: 'saksham@chitkara.edu.in',
    password: 'password123',
  },
  preferences: {
    currency: 'INR',
    themeAccent: 'emerald',
    dateFormat: 'DD/MM/YYYY',
  },
  transactions: [
    {
      id: 'tx-1',
      type: 'income',
      title: 'Monthly Tech Salary',
      amount: 85000,
      category: 'Salary',
      date: '2026-10-01',
      notes: 'Software engineering direct deposit',
    },
    {
      id: 'tx-2',
      type: 'income',
      title: 'Freelance UI/UX Design',
      amount: 24000,
      category: 'Freelance',
      date: '2026-10-12',
      notes: 'Mobile dashboard client project',
    },
    {
      id: 'tx-3',
      type: 'income',
      title: 'Dividend Payout',
      amount: 4500,
      category: 'Investments',
      date: '2026-10-18',
      notes: 'Q3 Nifty Index ETF dividend',
    },
    {
      id: 'tx-4',
      type: 'expense',
      title: 'Apartment Rent',
      amount: 22000,
      category: 'Bills',
      date: '2026-10-02',
      notes: 'Monthly residence lease',
    },
    {
      id: 'tx-5',
      type: 'expense',
      title: 'Gourmet Groceries & Supplies',
      amount: 6800,
      category: 'Food',
      date: '2026-10-06',
      notes: 'Weekly pantry & fresh produce',
    },
    {
      id: 'tx-6',
      type: 'expense',
      title: 'Weekend Dining & Cafe',
      amount: 3400,
      category: 'Food',
      date: '2026-10-15',
      notes: 'Dinner with university colleagues',
    },
    {
      id: 'tx-7',
      type: 'expense',
      title: 'Gadget & Tech Accessories',
      amount: 5200,
      category: 'Shopping',
      date: '2026-10-10',
      notes: 'Mechanical keyboard and USB-C hub',
    },
    {
      id: 'tx-8',
      type: 'expense',
      title: 'Metro Pass & Fuel',
      amount: 2600,
      category: 'Transport',
      date: '2026-10-14',
      notes: 'Commute expenses',
    },
    {
      id: 'tx-9',
      type: 'expense',
      title: 'Cloud & Entertainment Subscriptions',
      amount: 1499,
      category: 'Entertainment',
      date: '2026-10-08',
      notes: 'Spotify, Netflix & GitHub Pro',
    },
  ],
  budgets: [
    { id: 'b-1', category: 'Food', monthlyLimit: 14000 },
    { id: 'b-2', category: 'Shopping', monthlyLimit: 8000 },
    { id: 'b-3', category: 'Transport', monthlyLimit: 4500 },
    { id: 'b-4', category: 'Bills', monthlyLimit: 25000 },
    { id: 'b-5', category: 'Entertainment', monthlyLimit: 3000 },
    { id: 'b-6', category: 'Other', monthlyLimit: 5000 },
  ],
  goals: [
    {
      id: 'g-1',
      name: 'Emergency Fund',
      target: 150000,
      saved: 105000,
      date: '2026-12-31',
    },
    {
      id: 'g-2',
      name: 'MacBook Pro M3 Max',
      target: 180000,
      saved: 125000,
      date: '2026-11-30',
    },
    {
      id: 'g-3',
      name: 'Tokyo Travel Adventure',
      target: 200000,
      saved: 70000,
      date: '2027-04-15',
    },
  ],
  investments: [
    {
      id: 'inv-1',
      name: 'Nifty 50 Index Mutual Fund',
      type: 'Mutual Funds',
      invested: 80000,
      currentValue: 104500,
    },
    {
      id: 'inv-2',
      name: 'Bluechip Tech Stocks',
      type: 'Stocks',
      invested: 60000,
      currentValue: 73200,
    },
    {
      id: 'inv-3',
      name: 'Bank Fixed Deposit (7.25% p.a.)',
      type: 'Fixed Deposit',
      invested: 100000,
      currentValue: 107250,
    },
  ],
}
