import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="navbar" id="navbar">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <img
            src="/jobrisers-logo.svg"
            alt="JobRisers"
            className="navbar__logo-img"
            width="32"
            height="32"
          />
          <span className="navbar__logo-text">
            <span className="navbar__logo-text--job">Job</span><span className="navbar__logo-text--risers">Risers</span>
          </span>
        </Link>

        {/* Center navigation */}
        <nav
          className={`navbar__nav${mobileOpen ? ' navbar__nav--mobile-open' : ''}`}
          id="navbar-nav"
        >
          <Link to="/jobs">Jobs</Link>
          <Link to="/companies">Companies</Link>
          <a href="#career-advice">Career Advice</a>
          <a href="#for-employers">For Employers</a>
        </nav>

        {/* Right actions */}
        <div className="navbar__actions" id="navbar-actions">
          <Link to="/login" className="navbar__login" id="login-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Log in</Link>
          <Link to="/signup" className="navbar__signup" id="signup-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Sign up</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          id="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
