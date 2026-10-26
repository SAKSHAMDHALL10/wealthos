import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { validateForm } from '../utils.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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

    const fieldErrors = validateForm(form)
    if (form.password && form.password.length < 6) {
      fieldErrors.password = 'Password must be at least 6 characters'
    }
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-card-title">Create your account</h2>
        <p className="auth-card-subtitle">Set up WealthOS in under a minute.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Saksham Dhall"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              autoFocus
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="link-button">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
