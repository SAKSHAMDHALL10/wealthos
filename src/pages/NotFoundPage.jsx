import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-card panel">
        <span className="not-found-code">404</span>
        <h2>Page Not Found</h2>
        <p className="text-muted text-sm mb-4">
          The requested financial screen does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

