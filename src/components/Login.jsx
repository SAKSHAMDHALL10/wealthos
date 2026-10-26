import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { STORAGE_KEYS, loadData, validateForm, DEFAULT_DEMO_DATA } from '../utils.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: 'saksham@chitkara.edu.in', password: 'password123' })
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name] || errors.form) {
      setErrors({})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const fieldErrors = validateForm(form)
    const storedUser = loadData(STORAGE_KEYS.USER, DEFAULT_DEMO_DATA.user)

    if (!storedUser) {
      fieldErrors.form = 'No account found. Use Quick Demo Login or create an account.'
    } else if (
      Object.keys(fieldErrors).length === 0 &&
      (storedUser.email !== form.email || storedUser.password !== form.password)
    ) {
      // Allow fallback to demo user credentials if entered
      if (form.email === DEFAULT_DEMO_DATA.user.email && form.password === DEFAULT_DEMO_DATA.user.password) {
        login(DEFAULT_DEMO_DATA.user)
        navigate('/dashboard')
        return
      }
      fieldErrors.form = 'Incorrect email or password. You can click "Quick Demo Login" below.'
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    login(storedUser)
    navigate('/dashboard')
  }

  function handleDemoLogin() {
    login(DEFAULT_DEMO_DATA.user)
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2 className="auth-card-title">Welcome back</h2>
        <p className="auth-card-subtitle">Sign in to access your WealthOS financial dashboard.</p>

        {errors.form && <p className="form-error form-error-banner">{errors.form}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="auth-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <button
              type="button"
              className="link-button"
              onClick={() => alert('Password reset is simulated. Use password: password123')}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-block mt-2"
            onClick={handleDemoLogin}
          >
            ⚡ Quick Demo Login (Evaluator Viva)
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" className="link-button">
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
