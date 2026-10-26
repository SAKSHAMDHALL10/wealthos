import { useState, useEffect } from 'react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, validateForm } from '../../utils.js'

const getTodayDate = () => new Date().toISOString().split('T')[0]

export default function TransactionModalForm({
  initialType = 'expense',
  editingTransaction = null,
  onSubmit,
  onClose,
}) {
  const isEditing = Boolean(editingTransaction)

  const [form, setForm] = useState({
    type: initialType,
    title: '',
    amount: '',
    category: initialType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    date: getTodayDate(),
    notes: '',
  })

  const [errors, setErrors] = useState({})

  // If editing an existing transaction, populate initial values
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type || 'expense',
        title: editingTransaction.title || editingTransaction.name || editingTransaction.source || '',
        amount: String(editingTransaction.amount || ''),
        category: editingTransaction.category || (editingTransaction.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        date: editingTransaction.date || getTodayDate(),
        notes: editingTransaction.notes || '',
      })
    }
  }, [editingTransaction])

  // When type toggles between income and expense, adjust default category
  function handleTypeChange(newType) {
    setForm((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }))
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Validate fields
    const validationErrors = validateForm({
      title: form.title,
      amount: form.amount,
      date: form.date,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      type: form.type,
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes.trim(),
    }

    if (isEditing) {
      onSubmit({ id: editingTransaction.id, ...payload })
    } else {
      onSubmit(payload)
    }

    onClose()
  }

  const categoryOptions = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <form onSubmit={handleSubmit} noValidate className="modal-form">
      {/* Type Toggle */}
      {!isEditing && (
        <div className="form-type-toggle">
          <button
            type="button"
            className={`type-toggle-btn ${form.type === 'expense' ? 'toggle-active-expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${form.type === 'income' ? 'toggle-active-income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>
      )}

      {/* Title / Description */}
      <div className="field-group">
        <label htmlFor="tx-title">
          {form.type === 'income' ? 'Income Source / Title' : 'Expense Description / Name'} *
        </label>
        <input
          id="tx-title"
          name="title"
          type="text"
          placeholder={form.type === 'income' ? 'e.g. Salary, Consulting, Bonus' : 'e.g. Groceries, Electricity Bill'}
          value={form.title}
          onChange={handleChange}
          className={errors.title ? 'input-error' : ''}
          autoFocus
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      {/* Amount and Category */}
      <div className="field-row">
        <div className="field-group">
          <label htmlFor="tx-amount">Amount *</label>
          <input
            id="tx-amount"
            name="amount"
            type="number"
            min="1"
            step="any"
            placeholder="0"
            value={form.amount}
            onChange={handleChange}
            className={errors.amount ? 'input-error' : ''}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="tx-category">Category</label>
          <select id="tx-category" name="category" value={form.category} onChange={handleChange}>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div className="field-group">
        <label htmlFor="tx-date">Date *</label>
        <input
          id="tx-date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={errors.date ? 'input-error' : ''}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      {/* Notes / Remarks */}
      <div className="field-group">
        <label htmlFor="tx-notes">Optional Notes</label>
        <input
          id="tx-notes"
          name="notes"
          type="text"
          placeholder="e.g. Shared with roommates, receipt #42"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </div>
    </form>
  )
}

