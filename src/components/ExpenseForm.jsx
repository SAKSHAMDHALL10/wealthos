import { useState } from 'react'
import { EXPENSE_CATEGORIES, validateForm } from '../utils.js'

const today = () => new Date().toISOString().split('T')[0]

// `editingTransaction` is null when adding a brand new expense, or the
// existing record when the user clicked Edit. Same form, two modes.
export default function ExpenseForm({ onAdd, onUpdate, onClose, editingTransaction }) {
  const isEditing = Boolean(editingTransaction)

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          name: editingTransaction.name,
          amount: editingTransaction.amount,
          category: editingTransaction.category,
          date: editingTransaction.date,
        }
      : { name: '', amount: '', category: EXPENSE_CATEGORIES[0], date: today() }
  )
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validateForm(form)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    if (isEditing) {
      onUpdate(editingTransaction.id, { ...form, amount: Number(form.amount) })
    } else {
      onAdd({ ...form, amount: Number(form.amount) })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="expense-name">Name</label>
        <input
          id="expense-name"
          name="name"
          type="text"
          placeholder="e.g. Groceries"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label htmlFor="expense-amount">Amount</label>
          <input
            id="expense-amount"
            name="amount"
            type="number"
            min="0"
            placeholder="0"
            value={form.amount}
            onChange={handleChange}
            className={errors.amount ? 'input-error' : ''}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="expense-category">Category</label>
          <select id="expense-category" name="category" value={form.category} onChange={handleChange}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="expense-date">Date</label>
        <input id="expense-date" name="date" type="date" value={form.date} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        {isEditing ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  )
}
