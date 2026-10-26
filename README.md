# WealthOS — Personal Wealth & Cashflow Operating System

**Front End Engineering-II (25CSE0203) — Chitkara University Project**   

WealthOS is a modern personal wealth management dashboard engineered with **React 18**, **Vite**, **React Router v7**, **Redux Toolkit**, and the **React Context API**.

---

## 🚀 Technical Architecture & Rubric Implementation

WealthOS satisfies all evaluation criteria of the Front End Engineering-II (FEE-II) university rubric:

### A. React Navigation, Layout & Page Structure
- **Routing Library:** `react-router-dom`
- **Application Routes:**
  - `/login`: User authentication view with one-click viva demo login.
  - `/signup`: User registration form with validation.
  - `/dashboard`: High-level wealth KPI overview, category spending donut chart, active goals, and recent ledger activity.
  - `/transactions`: Full transaction management ledger featuring type filtering, live text search, category dropdown, and edit/delete capabilities.
  - `/budgets`: Categorical monthly budget tracker with progress bars and dynamic threshold warnings (normal, near-limit, exceeded).
  - `/goals`: Milestone savings targets with target dates, completion badges, and deposit tracking.
  - `/investments`: Portfolio manager tracking capital invested, current valuations, and calculated ROI percentages.
  - `/settings`: Global preferences configurator and account profile editor.
  - `*`: 404 Not Found fallback view with a return button.
- **Shared Layout:** `src/components/layout/AppLayout.jsx` with responsive sidebar, active navigation states (`NavLink`), mobile drawer with backdrop, and top header.
- **Route Protection:** `src/components/ProtectedRoute.jsx` redirects unauthenticated access to `/login`.

### B. React Context API & State Architecture
- **Preferences Context:** `src/context/PreferencesContext.jsx`
  - Demonstrates `createContext()`, `PreferencesProvider`, and the custom hook `usePreferences()`.
  - Manages application-wide user preferences:
    - **Currency Switcher:** Supports `INR (₹)`, `USD ($)`, `EUR (€)`, and `GBP (£)`. Changing the currency instantly recalculates and re-formats all financial metrics across every card, chart, and ledger entry in the app.
    - **Theme Accent Switcher:** Supports `Emerald`, `Electric Cyan`, `Neon Violet`, and `Golden Amber`. Dynamically updates CSS root variables (`--emerald`, `--emerald-glow`) and glow effects in real-time.
- **Authentication Context:** `src/context/AuthContext.jsx`
  - Demonstrates clean authentication state separation (`user`, `isAuthenticated`, `login`, `signup`, `logout`, `updateProfile`).
- **State Separation:** Persistent app-wide settings live in Context; the transactional financial ledger lives in Redux Toolkit; temporary UI states (modals, search queries, active tabs) remain local component states (`useState`).

### C. Redux Toolkit
- **Store Configuration:** `src/store/index.js` created using `configureStore()`.
- **Slices Implemented:**
  - `transactionsSlice.js`: Complete transaction ledger. Supports `addTransaction`, `updateTransaction`, `deleteTransaction`, `setFilter`, `setCategoryFilter`, `setSearchQuery`, and `resetTransactionsToDemo`. Includes memoized selectors for calculating total income, total expenses, balance, and category spending.
  - `budgetsSlice.js`: Monthly category spending limits. Supports `setBudget`, `deleteBudget`, and `resetBudgetsToDemo`.
  - `goalsSlice.js`: Savings milestones. Supports `addGoal`, `updateGoalSaved`, and `deleteGoal`.
  - `investmentsSlice.js`: Investment assets. Supports `addInvestment`, `updateInvestmentValue`, and `deleteInvestment`.
- **React-Redux Integration:** Application wrapped in `<Provider store={store}>`; UI components leverage `useSelector()` for declarative subscriptions and `useDispatch()` for triggering state transitions.

### D. Form Handling in React
- **Controlled Components:** All form inputs bind `value` to state and capture user keystrokes via `onChange`.
- **Submission Control:** Event handling with `e.preventDefault()` across all forms.
- **Validation:**
  - Required field validations with localized inline error messages (`errors[field]`).
  - Strict numeric validation (positive amounts, non-negative valuations).
  - Date format integrity and password length/match verification.
  - Real-time field error clearance upon user typing.
- **User Feedback & Reset:** Success notifications rendered via `Toast` component, forms reset on close and submission.

---

## 🛠️ Getting Started

### Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build & Preview

```bash
npm run build      # Generates optimized production build in dist/
npm run preview    # Serves the production build locally
```

---

## 📂 Source Code Structure

```
wealthos/
├── index.html
├── src/
│   ├── main.jsx                       # Application bootstrap (Redux, Context, Router Providers)
│   ├── App.jsx                        # Route configuration & ProtectedRoute hierarchy
│   ├── style.css                      # Design system, CSS custom properties, responsive layout
│   ├── utils.js                       # Pure JavaScript helpers, validation, and demo dataset
│   ├── context/
│   │   ├── PreferencesContext.jsx     # Currency & theme accent Context API implementation
│   │   └── AuthContext.jsx            # User authentication state provider
│   ├── store/
│   │   ├── index.js                   # Redux store configured via configureStore()
│   │   ├── transactionsSlice.js       # Income & expense slice with selectors
│   │   ├── budgetsSlice.js            # Category budget slice
│   │   ├── goalsSlice.js              # Savings goals slice
│   │   └── investmentsSlice.js        # Investment portfolio slice
│   ├── pages/
│   │   ├── DashboardPage.jsx          # Overview dashboard with charts & summary KPI cards
│   │   ├── TransactionsPage.jsx       # Transaction ledger with search & category filters
│   │   ├── BudgetsPage.jsx            # Monthly budget limit manager & threshold alerts
│   │   ├── GoalsPage.jsx              # Savings milestone tracker
│   │   ├── InvestmentsPage.jsx        # Investment portfolio manager with ROI calculation
│   │   ├── SettingsPage.jsx           # Preferences form (Context API), profile, & demo reset
│   │   └── NotFoundPage.jsx           # 404 Route fallback
│   └── components/
│       ├── layout/
│       │   └── AppLayout.jsx          # Shared authenticated shell (Sidebar + Header + Outlet)
│       ├── forms/
│       │   ├── TransactionModalForm.jsx # Controlled income/expense modal form
│       │   └── BudgetModalForm.jsx    # Controlled budget limit modal form
│       ├── Sidebar.jsx                # Responsive navigation sidebar with NavLink
│       ├── Header.jsx                 # Dynamic header with greeting, currency pill, and avatar
│       ├── ProtectedRoute.jsx         # Route guard for authenticated views
│       ├── SummaryCard.jsx            # KPI metric cards
│       ├── BudgetCard.jsx             # Category budget card with progress & warning badges
│       ├── GoalCard.jsx               # Milestone card with add-funds action
│       ├── InvestmentCard.jsx         # Investment card with ROI pill & value updater
│       ├── TransactionList.jsx        # Filterable & searchable transaction feed
│       ├── ExpenseChart.jsx           # CSS conic-gradient donut breakdown chart
│       ├── Modal.jsx                  # Reusable accessible dialog modal
│       ├── Toast.jsx                  # Auto-dismissing notification banner
│       ├── EmptyState.jsx             # Empty state placeholder with call-to-action
│       ├── Login.jsx                  # Login view with quick demo credentials
│       ├── Signup.jsx                 # Registration view
│       └── AuthLayout.jsx             # Authentication split-screen layout
├── package.json
└── README.md
```

---

## 🎓 University Viva Checklist (Chitkara University)

1. **How to demonstrate React Router:**
   - Click between navigation items in the sidebar. Note URL transitions (`/dashboard` -> `/transactions` -> `/budgets` -> `/goals` -> `/investments` -> `/settings`).
   - Refresh directly on `/budgets` or `/settings` to show direct routing works without losing state.
   - Enter an invalid URL such as `/test-404` to demonstrate the custom 404 page.

2. **How to demonstrate Context API:**
   - Navigate to `/settings`.
   - Change the currency dropdown from `INR (₹)` to `USD ($)` or `EUR (€)`.
   - Observe how every card, transaction item, goal, and chart across the entire application immediately updates its currency symbol and formatted numbers.
   - Change the **Theme Accent Color** to `Electric Cyan` or `Neon Violet`. Observe immediate CSS custom property reconfiguration and glowing effects across the application.

3. **How to demonstrate Redux Toolkit:**
   - In `/transactions`, add a new Income or Expense.
   - Inspect Redux state updating via `useDispatch(addTransaction(...))`.
   - Observe the Dashboard balances, summary cards, and category breakdown chart automatically recalculating via Redux selectors (`useSelector(selectBalance)`).
   - In `/budgets`, modify a budget limit and observe immediate threshold warnings (exceeded badge and red progress bar if expenses exceed the limit).

4. **How to demonstrate Form Handling:**
   - Open "+ Add Expense" or "+ Create Goal".
   - Submit empty fields to display inline required field validation.
   - Enter a negative or zero amount to demonstrate numeric validation.
   - Fill in valid data, submit, observe the automatic form reset, modal closure, and success Toast feedback.
