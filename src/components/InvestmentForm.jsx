import { useState } from 'react'
import { INVESTMENT_TYPES, validateForm } from '../utils.js'

export default function InvestmentForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    type: INVESTMENT_TYPES[0],
    invested: '',
    currentValue: '',
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
    const fieldErrors = validateForm({
      name: form.name,
      invested: form.invested,
      currentValue: form.currentValue,
    })
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    onAdd({
      name: form.name.trim(),
      type: form.type,
      invested: Number(form.invested),
      currentValue: Number(form.currentValue),
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="modal-form">
      <div className="field-group">
        <label htmlFor="inv-name">Asset / Investment Name *</label>
        <input
          id="inv-name"
          name="name"
          type="text"
          placeholder="e.g. Nifty 50 Index, Apple Inc, Gold Sovereign"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          autoFocus
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="field-group">
        <label htmlFor="inv-type">Asset Class</label>
        <select id="inv-type" name="type" value={form.type} onChange={handleChange}>
          {INVESTMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label htmlFor="inv-invested">Invested Amount *</label>
          <input
            id="inv-invested"
            name="invested"
            type="number"
            min="1"
            placeholder="0"
            value={form.invested}
            onChange={handleChange}
            className={errors.invested ? 'input-error' : ''}
          />
          {errors.invested && <span className="form-error">{errors.invested}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="inv-current">Current Valuation *</label>
          <input
            id="inv-current"
            name="currentValue"
            type="number"
            min="0"
            placeholder="0"
            value={form.currentValue}
            onChange={handleChange}
            className={errors.currentValue ? 'input-error' : ''}
          />
          {errors.currentValue && <span className="form-error">{errors.currentValue}</span>}
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Add Investment
        </button>
      </div>
    </form>
  )
}
