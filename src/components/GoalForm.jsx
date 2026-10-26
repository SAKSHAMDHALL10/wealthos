import { useState } from 'react'
import { validateForm } from '../utils.js'

export default function GoalForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', target: '', saved: '', date: '' })
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
    const fieldErrors = validateForm({ name: form.name, target: form.target, date: form.date })
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    onAdd({
      name: form.name.trim(),
      target: Number(form.target),
      saved: Number(form.saved) || 0,
      date: form.date,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="modal-form">
      <div className="field-group">
        <label htmlFor="goal-name">Goal Name *</label>
        <input
          id="goal-name"
          name="name"
          type="text"
          placeholder="e.g. MacBook Pro, Japan Trip, Emergency Fund"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          autoFocus
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label htmlFor="goal-target">Target Amount *</label>
          <input
            id="goal-target"
            name="target"
            type="number"
            min="1"
            placeholder="0"
            value={form.target}
            onChange={handleChange}
            className={errors.target ? 'input-error' : ''}
          />
          {errors.target && <span className="form-error">{errors.target}</span>}
        </div>

        <div className="field-group">
          <label htmlFor="goal-saved">Already Saved</label>
          <input
            id="goal-saved"
            name="saved"
            type="number"
            min="0"
            placeholder="0"
            value={form.saved}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="goal-date">Target Completion Date *</label>
        <input
          id="goal-date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={errors.date ? 'input-error' : ''}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create Goal
        </button>
      </div>
    </form>
  )
}
