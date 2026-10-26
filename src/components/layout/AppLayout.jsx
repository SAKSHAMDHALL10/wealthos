import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Sidebar from '../Sidebar.jsx'
import Header from '../Header.jsx'
import Modal from '../Modal.jsx'
import Toast from '../Toast.jsx'
import TransactionModalForm from '../forms/TransactionModalForm.jsx'
import { addTransaction } from '../../store/transactionsSlice.js'

export default function AppLayout() {
  const dispatch = useDispatch()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [modalType, setModalType] = useState('expense')
  const [toastMessage, setToastMessage] = useState(null)

  function showToast(message) {
    setToastMessage(message)
  }

  function handleOpenQuickAdd(type = 'expense') {
    setModalType(type)
    setTransactionModalOpen(true)
  }

  function handleCloseModal() {
    setTransactionModalOpen(false)
  }

  function handleAddTransaction(data) {
    dispatch(addTransaction(data))
    showToast(`${data.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="dashboard-main">
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          onQuickAdd={() => handleOpenQuickAdd('expense')}
        />

        <main className="dashboard-content">
          <Outlet context={{ showToast, openQuickAdd: handleOpenQuickAdd }} />
        </main>
      </div>

      {transactionModalOpen && (
        <Modal
          title={`Add ${modalType === 'income' ? 'Income' : 'Expense'}`}
          onClose={handleCloseModal}
        >
          <TransactionModalForm
            initialType={modalType}
            onSubmit={handleAddTransaction}
            onClose={handleCloseModal}
          />
        </Modal>
      )}

      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  )
}

