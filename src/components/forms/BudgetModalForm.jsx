import { useState } from 'react'
import { EXPENSE_CATEGORIES, validateForm } from '../../utils.js'

export default function BudgetModalForm({ onSubmit, onClose, existingCategories = [] }) {
  // Pick first category that isn't already budgeted if possible
  const availableCategories = EXPENSE_CATEGORIES.filter((c) => !existingCategories.includes(c))
  const initialCat = availableCategories.length > 0 ? availableCategories[0] : EXPENSE_CATEGORIES[0]

  const [form, setForm] = useState({
    category: initialCat,
    monthlyLimit: '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateForm({
      category: form.category,
      monthlyLimit: form.monthlyLimit,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit({
      category: form.category,
      monthlyLimit: Number(form.monthlyLimit),
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="modal-form">
      <div className="field-group">
        <label htmlFor="budget-category">Expense Category *</label>
        <select
          id="budget-category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="budget-limit">Monthly Spending Limit *</label>
        <input
          id="budget-limit"
          name="monthlyLimit"
          type="number"
          min="1"
          placeholder="e.g. 15000"
          value={form.monthlyLimit}
          onChange={handleChange}
          className={errors.monthlyLimit ? 'input-error' : ''}
          autoFocus
        />
        {errors.monthlyLimit && <span className="form-error">{errors.monthlyLimit}</span>}
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Budget
        </button>
      </div>
    </form>
  )
}

