import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import BudgetCard from '../components/BudgetCard.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import BudgetModalForm from '../components/forms/BudgetModalForm.jsx'
import { selectAllBudgets, setBudget, deleteBudget } from '../store/budgetsSlice.js'
import { selectAllTransactions } from '../store/transactionsSlice.js'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function BudgetsPage() {
  const dispatch = useDispatch()
  const { showToast } = useOutletContext()
  const { formatMoney } = usePreferences()

  const budgets = useSelector(selectAllBudgets)
  const transactions = useSelector(selectAllTransactions)
  const [modalOpen, setModalOpen] = useState(false)

  const expenses = transactions.filter((t) => t.type === 'expense')

  // Calculate total spent per category
  const categorySpentMap = expenses.reduce((acc, tx) => {
    const cat = tx.category || 'Other'
    acc[cat] = (acc[cat] || 0) + Number(tx.amount || 0)
    return acc
  }, {})

  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit || 0), 0)
  const totalSpentAcrossBudgets = budgets.reduce(
    (sum, b) => sum + Number(categorySpentMap[b.category] || 0),
    0
  )
  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpentAcrossBudgets / totalBudgeted) * 100) : 0
  const totalRemaining = totalBudgeted - totalSpentAcrossBudgets

  function handleCreateBudget(data) {
    dispatch(setBudget(data))
    showToast(`Budget for ${data.category} created!`)
  }

  function handleUpdateBudget(category, newLimit) {
    dispatch(setBudget({ category, monthlyLimit: newLimit }))
    showToast(`Budget for ${category} updated to ${formatMoney(newLimit)}!`)
  }

  function handleDeleteBudget(id) {
    dispatch(deleteBudget(id))
    showToast('Budget deleted')
  }

  return (
    <div className="budgets-page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Category Budgets</h2>
            <p className="text-muted text-sm">
              Keep your spending under control with monthly categorical caps
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Set New Budget
          </button>
        </div>

        {/* Budget Summary Bar */}
        <div className="ledger-stats-bar">
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Limit:</span>
            <strong>{formatMoney(totalBudgeted)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Spent:</span>
            <strong className={totalRemaining < 0 ? 'text-red' : 'text-emerald'}>
              {formatMoney(totalSpentAcrossBudgets)}
            </strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Remaining:</span>
            <strong className={totalRemaining >= 0 ? 'text-emerald' : 'text-red'}>
              {formatMoney(totalRemaining)}
            </strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Overall Spent:</span>
            <strong className={overallPercent >= 100 ? 'text-red' : overallPercent >= 80 ? 'text-amber' : 'text-emerald'}>
              {overallPercent}%
            </strong>
          </div>
        </div>

        {budgets.length === 0 ? (
          <EmptyState
            title="No category budgets configured"
            message="Add monthly spending limits for categories such as Food, Bills, Shopping, or Transport."
            actionLabel="Add Budget"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="budget-grid mt-4">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={categorySpentMap[budget.category] || 0}
                onEdit={handleUpdateBudget}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <Modal title="Set Category Budget" onClose={() => setModalOpen(false)}>
          <BudgetModalForm
            onSubmit={handleCreateBudget}
            onClose={() => setModalOpen(false)}
            existingCategories={budgets.map((b) => b.category)}
          />
        </Modal>
      )}
    </div>
  )
}

