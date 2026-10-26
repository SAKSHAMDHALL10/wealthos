import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import InvestmentCard from '../components/InvestmentCard.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import InvestmentForm from '../components/InvestmentForm.jsx'
import {
  selectAllInvestments,
  selectTotalInvested,
  selectTotalCurrentValue,
  selectTotalInvestmentProfit,
  addInvestment,
  updateInvestmentValue,
  deleteInvestment,
} from '../store/investmentsSlice.js'
import { usePreferences } from '../context/PreferencesContext.jsx'
import { calculateProfitPercentage } from '../utils.js'

export default function InvestmentsPage() {
  const dispatch = useDispatch()
  const { showToast } = useOutletContext()
  const { formatMoney } = usePreferences()

  const investments = useSelector(selectAllInvestments)
  const totalInvested = useSelector(selectTotalInvested)
  const totalValue = useSelector(selectTotalCurrentValue)
  const totalProfit = useSelector(selectTotalInvestmentProfit)
  const overallRoi = calculateProfitPercentage(totalInvested, totalValue)

  const [modalOpen, setModalOpen] = useState(false)

  function handleAddInvestment(data) {
    dispatch(addInvestment(data))
    showToast(`Asset "${data.name}" added to portfolio!`)
  }

  function handleUpdateValue(id, newVal) {
    dispatch(updateInvestmentValue({ id, newValue: newVal }))
    showToast(`Valuation updated to ${formatMoney(newVal)}!`)
  }

  function handleDelete(id) {
    dispatch(deleteInvestment(id))
    showToast('Investment removed')
  }

  return (
    <div className="investments-page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Investment Portfolio</h2>
            <p className="text-muted text-sm">
              Track equity, mutual funds, and fixed deposits with real-time ROI
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Add Asset
          </button>
        </div>

        {/* Portfolio Stats Bar */}
        <div className="ledger-stats-bar">
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Assets:</span>
            <strong>{investments.length}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Capital Invested:</span>
            <strong>{formatMoney(totalInvested)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Current Portfolio Value:</span>
            <strong className="text-emerald">{formatMoney(totalValue)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Unrealized Gain/Loss:</span>
            <strong className={totalProfit >= 0 ? 'text-emerald' : 'text-red'}>
              {totalProfit >= 0 ? '+' : ''}
              {formatMoney(totalProfit)} ({overallRoi >= 0 ? `+${overallRoi}%` : `${overallRoi}%`})
            </strong>
          </div>
        </div>

        {investments.length === 0 ? (
          <EmptyState
            title="No investments recorded"
            message="Add mutual funds, equity shares, or fixed income assets to track your wealth growth."
            actionLabel="Add Investment"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="card-grid mt-4">
            {investments.map((inv) => (
              <InvestmentCard
                key={inv.id}
                investment={inv}
                onUpdateValue={handleUpdateValue}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <Modal title="Add Investment Asset" onClose={() => setModalOpen(false)}>
          <InvestmentForm
            onAdd={handleAddInvestment}
            onClose={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}

