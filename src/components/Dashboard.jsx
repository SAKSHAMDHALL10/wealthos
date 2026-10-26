import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import SummaryCard from './SummaryCard.jsx'
import Modal from './Modal.jsx'
import EmptyState from './EmptyState.jsx'
import IncomeForm from './IncomeForm.jsx'
import ExpenseForm from './ExpenseForm.jsx'
import GoalForm from './GoalForm.jsx'
import GoalCard from './GoalCard.jsx'
import InvestmentForm from './InvestmentForm.jsx'
import InvestmentCard from './InvestmentCard.jsx'
import TransactionList from './TransactionList.jsx'
import ExpenseChart from './ExpenseChart.jsx'
import Toast from './Toast.jsx'
import { sumAmounts, calculateBalance, formatCurrency, buildTransactions } from '../utils.js'

const ICONS = {
  balance: 'M3 10h18M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z',
  income: 'M12 19V5M5 12l7-7 7 7',
  expense: 'M12 5v14M5 12l7 7 7-7',
  invest: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
}

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

export default function Dashboard(props) {
  const {
    user,
    income,
    expenses,
    goals,
    investments,
    onAddIncome,
    onUpdateIncome,
    onDeleteIncome,
    onAddExpense,
    onUpdateExpense,
    onDeleteExpense,
    onAddGoal,
    onUpdateGoalSaved,
    onDeleteGoal,
    onAddInvestment,
    onUpdateInvestmentValue,
    onDeleteInvestment,
    onLogout,
  } = props

  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [modal, setModal] = useState(null)

  const [editingTransaction, setEditingTransaction] = useState(null)
  const [toast, setToast] = useState(null)

  const totalIncome = sumAmounts(income)
  const totalExpenses = sumAmounts(expenses)
  const balance = calculateBalance(income, expenses)

  // Calculate total investment value for the dashboard
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0)

  const transactions = buildTransactions(income, expenses)

  function openAddModal(type) {
    setEditingTransaction(null)
    setModal(type)
  }

  function closeModal() {
    setModal(null)
    setEditingTransaction(null)
  }

  function handleEditTransaction(tx) {
    setEditingTransaction(tx)
    setModal(tx.type)
  }

  function handleDeleteTransaction(tx) {
    if (tx.type === 'income') onDeleteIncome(tx.id)
    else onDeleteExpense(tx.id)
    setToast('Transaction deleted')
  }

  function handleAddIncome(entry) {
    onAddIncome(entry)
    setToast('Income added')
  }

  function handleUpdateIncome(id, entry) {
    onUpdateIncome(id, entry)
    setToast('Transaction updated successfully')
  }

  function handleAddExpense(entry) {
    onAddExpense(entry)
    setToast('Expense added')
  }

  function handleUpdateExpense(id, entry) {
    onUpdateExpense(id, entry)
    setToast('Transaction updated successfully')
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        active={activeSection}
        onNavigate={setActiveSection}
        onLogout={onLogout}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="dashboard-main">
        <Header user={user} onMenuClick={() => setMobileNavOpen(true)} />

        <main className="dashboard-content">
          {activeSection === 'dashboard' && (
            <>
              <div className="summary-grid">
                <SummaryCard label="Total Balance" value={formatCurrency(balance)} icon={<Icon path={ICONS.balance} />} glow tone="emerald" />
                <SummaryCard label="Total Income" value={formatCurrency(totalIncome)} icon={<Icon path={ICONS.income} />} tone="emerald" />
                <SummaryCard label="Total Expenses" value={formatCurrency(totalExpenses)} icon={<Icon path={ICONS.expense} />} tone="red" />
                <SummaryCard label="Investments" value={formatCurrency(totalInvestmentValue)} icon={<Icon path={ICONS.invest} />} />
              </div>

              <div className="action-row">
                <button className="btn btn-primary" onClick={() => openAddModal('income')}>
                  + Add Income
                </button>
                <button className="btn btn-secondary" onClick={() => openAddModal('expense')}>
                  + Add Expense
                </button>
              </div>

              <div className="content-grid">
                <section className="panel">
                  <h3>Spending by Category</h3>
                  <ExpenseChart expenses={expenses} />
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <h3>Recent Transactions</h3>
                    <button className="link-button" onClick={() => setActiveSection('transactions')}>
                      View all
                    </button>
                  </div>

                  <TransactionList
                    transactions={transactions}
                    limit={5}
                    onAddFirst={() => openAddModal('income')}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </section>
              </div>

              <section className="panel">
                <div className="panel-header">
                  <h3>Savings Goals</h3>
                  <button className="link-button" onClick={() => setActiveSection('goals')}>
                    View all
                  </button>
                </div>

                {goals.length === 0 ? (
                  <EmptyState
                    title="No goals yet"
                    message="Create a savings goal to start tracking your progress."
                    actionLabel="Create Goal"
                    onAction={() => setModal('goal')}
                  />
                ) : (
                  <div className="card-grid">
                    {goals.slice(0, 3).map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onAddFunds={onUpdateGoalSaved} onDelete={onDeleteGoal} />
                    ))}
                  </div>
                )}
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h3>Investments</h3>
                  <button className="link-button" onClick={() => setActiveSection('investments')}>
                    View all
                  </button>
                </div>

                {investments.length === 0 ? (
                  <EmptyState
                    title="No investments yet"
                    message="Add an investment to see your portfolio's performance."
                    actionLabel="Add Investment"
                    onAction={() => setModal('investment')}
                  />
                ) : (
                  <div className="card-grid">
                    {investments.slice(0, 3).map((inv) => (
                      <InvestmentCard
                        key={inv.id}
                        investment={inv}
                        onUpdateValue={onUpdateInvestmentValue}
                        onDelete={onDeleteInvestment}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {activeSection === 'transactions' && (
            <section className="panel">
              <div className="panel-header">
                <h3>All Transactions</h3>

                <div className="action-row action-row-tight">
                  <button className="btn btn-primary btn-sm" onClick={() => openAddModal('income')}>
                    + Add Income
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openAddModal('expense')}>
                    + Add Expense
                  </button>
                </div>
              </div>

              <TransactionList
                transactions={transactions}
                showFilters
                onAddFirst={() => openAddModal('income')}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </section>
          )}

          {activeSection === 'goals' && (
            <section className="panel">
              <div className="panel-header">
                <h3>Savings Goals</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setModal('goal')}>
                  + New Goal
                </button>
              </div>

              {goals.length === 0 ? (
                <EmptyState
                  title="No goals yet"
                  message="Create a savings goal to start tracking your progress."
                  actionLabel="Create Goal"
                  onAction={() => setModal('goal')}
                />
              ) : (
                <div className="card-grid">
                  {goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onAddFunds={onUpdateGoalSaved} onDelete={onDeleteGoal} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'investments' && (
            <section className="panel">
              <div className="panel-header">
                <h3>Investments</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setModal('investment')}>
                  + Add Investment
                </button>
              </div>

              {investments.length === 0 ? (
                <EmptyState
                  title="No investments yet"
                  message="Add an investment to see your portfolio's performance."
                  actionLabel="Add Investment"
                  onAction={() => setModal('investment')}
                />
              ) : (
                <div className="card-grid">
                  {investments.map((inv) => (
                    <InvestmentCard
                      key={inv.id}
                      investment={inv}
                      onUpdateValue={onUpdateInvestmentValue}
                      onDelete={onDeleteInvestment}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'settings' && (
            <section className="panel">
              <h3>Account</h3>

              <div className="settings-row">
                <span className="text-muted">Full name</span>
                <span>{user?.name}</span>
              </div>

              <div className="settings-row">
                <span className="text-muted">Email</span>
                <span>{user?.email}</span>
              </div>

              <div className="settings-row">
                <span className="text-muted">Currency</span>
                <span>INR (₹)</span>
              </div>

              <p className="text-muted settings-note">
                WealthOS stores everything in this browser's local storage — no data leaves your device.
              </p>
            </section>
          )}
        </main>
      </div>

      {modal === 'income' && (
        <Modal title={editingTransaction ? 'Edit Income' : 'Add Income'} onClose={closeModal}>
          <IncomeForm
            onAdd={handleAddIncome}
            onUpdate={handleUpdateIncome}
            onClose={closeModal}
            editingTransaction={editingTransaction}
          />
        </Modal>
      )}

      {modal === 'expense' && (
        <Modal title={editingTransaction ? 'Edit Expense' : 'Add Expense'} onClose={closeModal}>
          <ExpenseForm
            onAdd={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onClose={closeModal}
            editingTransaction={editingTransaction}
          />
        </Modal>
      )}

      {modal === 'goal' && (
        <Modal title="Create Savings Goal" onClose={closeModal}>
          <GoalForm onAdd={onAddGoal} onClose={closeModal} />
        </Modal>
      )}

      {modal === 'investment' && (
        <Modal title="Add Investment" onClose={closeModal}>
          <InvestmentForm onAdd={onAddInvestment} onClose={closeModal} />
        </Modal>
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}