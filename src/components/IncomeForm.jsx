import { useState } from 'react'
import { INCOME_CATEGORIES, validateForm } from '../utils.js'

const today = () => new Date().toISOString().split('T')[0]

// `editingTransaction` is null when adding a brand new income entry, or the
// existing record when the user clicked Edit. Same form, two modes.
export default function IncomeForm({ onAdd, onUpdate, onClose, editingTransaction }) {
  const isEditing = Boolean(editingTransaction)

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          source: editingTransaction.source,
          amount: editingTransaction.amount,
          category: editingTransaction.category,
          date: editingTransaction.date,
        }
      : { source: '', amount: '', category: INCOME_CATEGORIES[0], date: today() }
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
        <label htmlFor="source">Source</label>
        <input
          id="source"
          name="source"
          type="text"
          placeholder="e.g. Salary"
          value={form.source}
          onChange={handleChange}
          className={errors.source ? 'input-error' : ''}
        />
        {errors.source && <span className="form-error">{errors.source}</span>}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label htmlFor="income-amount">Amount</label>
          <input
            id="income-amount"
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
          <label htmlFor="income-category">Category</label>
          <select id="income-category" name="category" value={form.category} onChange={handleChange}>
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="income-date">Date</label>
        <input id="income-date" name="date" type="date" value={form.date} onChange={handleChange} />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        {isEditing ? 'Update Income' : 'Add Income'}
      </button>
    </form>
  )
}
