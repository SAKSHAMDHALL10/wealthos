import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import SummaryCard from '../components/SummaryCard.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import GoalCard from '../components/GoalCard.jsx'
import InvestmentCard from '../components/InvestmentCard.jsx'
import TransactionList from '../components/TransactionList.jsx'
import ExpenseChart from '../components/ExpenseChart.jsx'
import TransactionModalForm from '../components/forms/TransactionModalForm.jsx'
import GoalForm from '../components/GoalForm.jsx'
import InvestmentForm from '../components/InvestmentForm.jsx'
import BudgetCard from '../components/BudgetCard.jsx'

import {
  selectAllTransactions,
  selectTotalIncome,
  selectTotalExpenses,
  selectBalance,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../store/transactionsSlice.js'
import { selectAllBudgets, setBudget, deleteBudget } from '../store/budgetsSlice.js'
import { selectAllGoals, addGoal, updateGoalSaved, deleteGoal } from '../store/goalsSlice.js'
import {
  selectAllInvestments,
  selectTotalCurrentValue,
  addInvestment,
  updateInvestmentValue,
  deleteInvestment,
} from '../store/investmentsSlice.js'

import { usePreferences } from '../context/PreferencesContext.jsx'
import { calculateSavingsRate, calculateNetWorth } from '../utils.js'

const ICONS = {
  balance: 'M3 10h18M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z',
  income: 'M12 19V5M5 12l7-7 7 7',
  expense: 'M12 5v14M5 12l7 7 7-7',
  invest: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  savings: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  networth: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { showToast } = useOutletContext()
  const { formatMoney } = usePreferences()

  // Redux Toolkit Selectors
  const transactions = useSelector(selectAllTransactions)
  const totalIncome = useSelector(selectTotalIncome)
  const totalExpenses = useSelector(selectTotalExpenses)
  const balance = useSelector(selectBalance)
  const budgets = useSelector(selectAllBudgets)
  const goals = useSelector(selectAllGoals)
  const investments = useSelector(selectAllInvestments)
  const totalInvestments = useSelector(selectTotalCurrentValue)

  // Modals state
  const [modalType, setModalType] = useState(null)
  const [editingTx, setEditingTx] = useState(null)

  const expenses = transactions.filter((t) => t.type === 'expense')
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)
  const netWorth = calculateNetWorth(balance, investments)

  // Calculate spent per budget category
  const categorySpentMap = expenses.reduce((acc, tx) => {
    const cat = tx.category || 'Other'
    acc[cat] = (acc[cat] || 0) + Number(tx.amount || 0)
    return acc
  }, {})

  function openModal(type, tx = null) {
    setEditingTx(tx)
    setModalType(type)
  }

  function closeModal() {
    setModalType(null)
    setEditingTx(null)
  }

  function handleSaveTransaction(data) {
    if (editingTx) {
      dispatch(updateTransaction(data))
      showToast('Transaction updated successfully!')
    } else {
      dispatch(addTransaction(data))
      showToast(`${data.type === 'income' ? 'Income' : 'Expense'} recorded!`)
    }
  }

  function handleDeleteTransaction(id) {
    dispatch(deleteTransaction(id))
    showToast('Transaction deleted!')
  }

  return (
    <div className="dashboard-page">
      {/* KPI Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          label="Total Balance"
          value={formatMoney(balance)}
          icon={<Icon path={ICONS.balance} />}
          glow
          tone={balance >= 0 ? 'emerald' : 'red'}
        />
        <SummaryCard
          label="Total Income"
          value={formatMoney(totalIncome)}
          icon={<Icon path={ICONS.income} />}
          tone="emerald"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatMoney(totalExpenses)}
          icon={<Icon path={ICONS.expense} />}
          tone="red"
        />
        <SummaryCard
          label="Portfolio Value"
          value={formatMoney(totalInvestments)}
          icon={<Icon path={ICONS.invest} />}
        />
        <SummaryCard
          label="Estimated Net Worth"
          value={formatMoney(netWorth)}
          icon={<Icon path={ICONS.networth} />}
          tone="emerald"
        />
        <SummaryCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          icon={<Icon path={ICONS.savings} />}
        />
      </div>

      {/* Action Row */}
      <div className="action-row">
        <button className="btn btn-primary" onClick={() => openModal('income')}>
          + Add Income
        </button>
        <button className="btn btn-secondary" onClick={() => openModal('expense')}>
          + Add Expense
        </button>
      </div>

      {/* Charts & Recent Transactions */}
      <div className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Spending by Category</h3>
          </div>
          <ExpenseChart expenses={expenses} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Recent Transactions</h3>
            <Link to="/transactions" className="link-button">
              View all ({transactions.length})
            </Link>
          </div>

          <TransactionList
            transactions={transactions}
            limit={5}
            onAddFirst={() => openModal('expense')}
            onEdit={(tx) => openModal(tx.type, tx)}
            onDelete={handleDeleteTransaction}
          />
        </section>
      </div>

      {/* Budgets Section */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Monthly Budget Overview</h3>
            <p className="text-muted text-sm">Monitor your monthly spend limits per category</p>
          </div>
          <Link to="/budgets" className="link-button">
            Manage Budgets
          </Link>
        </div>

        {budgets.length === 0 ? (
          <EmptyState
            title="No budgets configured"
            message="Set monthly spending limits for categories like Food, Bills, or Shopping."
            actionLabel="Set Budget"
            onAction={() => openModal('budget')}
          />
        ) : (
          <div className="budget-grid">
            {budgets.slice(0, 3).map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                spent={categorySpentMap[b.category] || 0}
                onEdit={(cat, limit) => {
                  dispatch(setBudget({ category: cat, monthlyLimit: limit }))
                  showToast(`Budget for ${cat} updated!`)
                }}
                onDelete={(id) => {
                  dispatch(deleteBudget(id))
                  showToast('Budget deleted')
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Savings Goals Section */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Active Savings Goals</h3>
            <p className="text-muted text-sm">Track milestones towards your dream purchases</p>
          </div>
          <div className="action-row-tight">
            <button className="btn btn-primary btn-sm" onClick={() => openModal('goal')}>
              + New Goal
            </button>
            <Link to="/goals" className="link-button ml-2">
              View all ({goals.length})
            </Link>
          </div>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="No goals set yet"
            message="Create a savings goal to keep your long-term ambitions on track."
            actionLabel="Create Goal"
            onAction={() => openModal('goal')}
          />
        ) : (
          <div className="card-grid">
            {goals.slice(0, 3).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddFunds={(id, amt) => {
                  dispatch(updateGoalSaved({ id, amountToAdd: amt }))
                  showToast('Funds added to savings goal!')
                }}
                onDelete={(id) => {
                  dispatch(deleteGoal(id))
                  showToast('Goal deleted')
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Investments Section */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Investment Portfolio</h3>
            <p className="text-muted text-sm">Mutual funds, stocks, and fixed income assets</p>
          </div>
          <div className="action-row-tight">
            <button className="btn btn-primary btn-sm" onClick={() => openModal('investment')}>
              + Add Investment
            </button>
            <Link to="/investments" className="link-button ml-2">
              View all ({investments.length})
            </Link>
          </div>
        </div>

        {investments.length === 0 ? (
          <EmptyState
            title="No investments tracked"
            message="Add your mutual funds, equity, or FDs to track capital growth."
            actionLabel="Add Investment"
            onAction={() => openModal('investment')}
          />
        ) : (
          <div className="card-grid">
            {investments.slice(0, 3).map((inv) => (
              <InvestmentCard
                key={inv.id}
                investment={inv}
                onUpdateValue={(id, val) => {
                  dispatch(updateInvestmentValue({ id, newValue: val }))
                  showToast('Investment valuation updated!')
                }}
                onDelete={(id) => {
                  dispatch(deleteInvestment(id))
                  showToast('Investment removed')
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {(modalType === 'income' || modalType === 'expense') && (
        <Modal
          title={editingTx ? 'Edit Transaction' : `Add ${modalType === 'income' ? 'Income' : 'Expense'}`}
          onClose={closeModal}
        >
          <TransactionModalForm
            initialType={modalType}
            editingTransaction={editingTx}
            onSubmit={handleSaveTransaction}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modalType === 'goal' && (
        <Modal title="Create Savings Goal" onClose={closeModal}>
          <GoalForm
            onAdd={(newGoal) => {
              dispatch(addGoal(newGoal))
              showToast('Savings goal created!')
            }}
            onClose={closeModal}
          />
        </Modal>
      )}

      {modalType === 'investment' && (
        <Modal title="Add Asset to Portfolio" onClose={closeModal}>
          <InvestmentForm
            onAdd={(newInv) => {
              dispatch(addInvestment(newInv))
              showToast('Investment asset recorded!')
            }}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  )
}

