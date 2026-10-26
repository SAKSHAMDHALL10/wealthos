import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z',
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: 'M4 7h13M17 7l-3-3M17 7l-3 3M20 17H7M7 17l3 3M7 17l3-3',
  },
  {
    path: '/budgets',
    label: 'Budgets',
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    path: '/goals',
    label: 'Savings Goals',
    icon: 'M12 2 2 12l10 10 10-10L12 2Zm0 5.5L17.5 12 12 17.5 6.5 12 12 7.5Z',
  },
  {
    path: '/investments',
    label: 'Investments',
    icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a7.97 7.97 0 0 0-.2-1.8l2-1.6-2-3.4-2.4.9a8 8 0 0 0-3-1.7L14 2h-4l-.4 2.4a8 8 0 0 0-3 1.7l-2.4-.9-2 3.4 2 1.6A7.97 7.97 0 0 0 4 12c0 .6.07 1.2.2 1.8l-2 1.6 2 3.4 2.4-.9a8 8 0 0 0 3 1.7L10 22h4l.4-2.4a8 8 0 0 0 3-1.7l2.4.9 2-3.4-2-1.6c.13-.6.2-1.2.2-1.8Z',
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="brand-dot"></span>
          <span className="sidebar-logo-text">WealthOS</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onClose}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="sidebar-link sidebar-logout"
          onClick={() => {
            onClose();
            logout();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Logout</span>
        </button>
      </aside>
    </>
  )
}
