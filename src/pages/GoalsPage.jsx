import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import GoalCard from '../components/GoalCard.jsx'
import Modal from '../components/Modal.jsx'
import EmptyState from '../components/EmptyState.jsx'
import GoalForm from '../components/GoalForm.jsx'
import {
  selectAllGoals,
  addGoal,
  updateGoalSaved,
  deleteGoal,
} from '../store/goalsSlice.js'
import { usePreferences } from '../context/PreferencesContext.jsx'

export default function GoalsPage() {
  const dispatch = useDispatch()
  const { showToast } = useOutletContext()
  const { formatMoney } = usePreferences()

  const goals = useSelector(selectAllGoals)
  const [modalOpen, setModalOpen] = useState(false)

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target || 0), 0)
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.saved || 0), 0)
  const completedCount = goals.filter((g) => Number(g.saved) >= Number(g.target)).length
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  function handleCreateGoal(data) {
    dispatch(addGoal(data))
    showToast(`Goal "${data.name}" created!`)
  }

  function handleAddFunds(id, amt) {
    dispatch(updateGoalSaved({ id, amountToAdd: amt }))
    showToast(`Added ${formatMoney(amt)} to savings goal!`)
  }

  function handleDelete(id) {
    dispatch(deleteGoal(id))
    showToast('Goal deleted')
  }

  return (
    <div className="goals-page">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Savings Goals</h2>
            <p className="text-muted text-sm">
              Plan and fund specific targets for gadgets, emergencies, or travels
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Create New Goal
          </button>
        </div>

        {/* Goals Summary Bar */}
        <div className="ledger-stats-bar">
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Goals:</span>
            <strong>{goals.length}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Achieved:</span>
            <strong className="text-emerald">{completedCount} of {goals.length}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Total Saved:</span>
            <strong className="text-emerald">{formatMoney(totalSaved)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Target Required:</span>
            <strong>{formatMoney(totalTarget)}</strong>
          </div>
          <div className="stat-pill">
            <span className="text-muted text-xs">Milestone Completion:</span>
            <strong className="text-emerald">{overallProgress}%</strong>
          </div>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="No savings goals yet"
            message="Create a dedicated savings target to stay financially focused."
            actionLabel="Create Goal"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="card-grid mt-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddFunds={handleAddFunds}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <Modal title="Create Savings Goal" onClose={() => setModalOpen(false)}>
          <GoalForm onSubmit={handleCreateGoal} onAdd={handleCreateGoal} onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  )
}

