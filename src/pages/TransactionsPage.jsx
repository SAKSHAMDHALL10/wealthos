import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import TransactionList from '../components/TransactionList.jsx'
import Modal from '../components/Modal.jsx'
import TransactionModalForm from '../components/forms/TransactionModalForm.jsx'
import {
  selectAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../store/transactionsSlice.js'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function TransactionsPage() {
  const dispatch = useDispatch()
  const { showToast } = useOutletContext()
  const { formatMoney } = usePreferences()
  const transactions = useSelector(selectAllTransactions)

  const [modalType, setModalType] = useState(null)
  const [editingTx, setEditingTx] = useState(null)

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

  function handleDelete(id) {
    dispatch(deleteTransaction(id))
    showToast('Transaction deleted!')
  }

  const incomeSum = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const expenseSum = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return (
    <div className="transactions-page">
      {/* Top Banner / Actions */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Transaction Ledger</h2>
            <p className="text-muted text-sm">
              Complete history of incoming cashflow and outgoing payments
            </p>
          </div>

          <div className="action-row action-row-tight">
            <button className="btn btn-primary" onClick={() => openModal('income')}>
              + Add Income
            </button>
            <button className="btn btn-secondary" onClick={() => openModal('expense')}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* Ledger Quick Stats */}
        <div className="ledger-stats-bar">
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Records:</span>
            <strong>{transactions.length}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Inflow:</span>
            <strong className="text-emerald">+{formatMoney(incomeSum)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Outflow:</span>
            <strong className="text-red">-{formatMoney(expenseSum)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Net Cashflow:</span>
            <strong className={incomeSum - expenseSum >= 0 ? 'text-emerald' : 'text-red'}>
              {formatMoney(incomeSum - expenseSum)}
            </strong>
          </div>
        </div>

        {/* Transaction Table / List with Search & Filters */}
        <TransactionList
          transactions={transactions}
          showFilters
          showSearch
          onAddFirst={() => openModal('income')}
          onEdit={(tx) => openModal(tx.type, tx)}
          onDelete={handleDelete}
        />
      </section>

      {/* Modal for Add / Edit */}
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
    </div>
  )
}

