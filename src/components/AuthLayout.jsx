// Shared split-screen shell for Login and Signup.
// Left side is purely decorative branding; right side renders whatever form is passed in.
export default function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <section className="auth-brand">
        <div className="auth-glow" aria-hidden="true"></div>

        <div className="auth-brand-content">
          <div className="brand-mark">
            <span className="brand-dot"></span>
            WEALTHOS
          </div>
          <h1 className="auth-tagline">
            Every Rupee.
            <br />
            Every Goal.
            <br />
            One Dashboard.
          </h1>
          <p className="auth-subtext">Your money, simplified.</p>
        </div>

        <div className="auth-visuals" aria-hidden="true">
          <div className="floating-card balance-card">
            <span className="floating-card-label">Total Balance</span>
            <span className="floating-card-value">₹1,25,000</span>
            <svg className="mini-chart" viewBox="0 0 120 40" preserveAspectRatio="none">
              <polyline
                points="0,32 15,28 30,30 45,20 60,22 75,12 90,15 105,6 120,8"
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="floating-card growth-badge">
            <span className="growth-arrow">↑</span>
            <span>12.4% this month</span>
          </div>
        </div>
      </section>

      <section className="auth-form-side">{children}</section>
    </div>
  )
}
