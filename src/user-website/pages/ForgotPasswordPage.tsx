import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../styles/signup.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setNotice({ type: 'error', message: 'Please enter your registered email address.' })
      return
    }

    setNotice({
      type: 'success',
      message: `A password reset link has been dispatched to ${email.trim()} if an associated JobRisers account exists.`,
    })
  }

  return (
    <div className="signup-page forgot-page">
      {/* --------------------------------------------
          Top Navigation Bar (Image 2 Exact Match)
          -------------------------------------------- */}
      <header className="signup-nav">
        <div className="signup-nav__container">
          {/* Logo */}
          <Link to="/" className="signup-nav__logo" id="forgot-logo">
            <img
              src="/jobrisers-logo.svg"
              alt="JobRisers"
              className="signup-nav__logo-img"
              width="32"
              height="32"
            />
            <span className="signup-nav__logo-text">
              <span className="signup-nav__logo-text--job">Job</span>
              <span className="signup-nav__logo-text--risers">Risers</span>
            </span>
          </Link>

          {/* Center Links */}
          <nav className="signup-nav__links">
            <Link to="/jobs">Jobs</Link>
            <Link to="/companies">Companies</Link>
            <Link to="/#career-advice">Career Advice</Link>
            <Link to="/#for-employers">For Employers</Link>
          </nav>

          {/* Right Spacer for Center Alignment */}
          <div className="forgot-nav-spacer" style={{ width: '130px' }} />
        </div>
      </header>

      {/* --------------------------------------------
          Main Content: Split Card + Blue Illustration
          -------------------------------------------- */}
      <main className="forgot-main">
        {/* Decorative Right-side Blue Wave Background */}
        <div className="forgot-bg-wave" aria-hidden="true">
          <svg viewBox="0 0 700 700" fill="none" preserveAspectRatio="none" className="forgot-bg-svg">
            <path
              d="M150 0 C 280 180, 50 360, 180 520 C 260 620, 320 680, 420 700 L 700 700 L 700 0 Z"
              fill="#e1effe"
              opacity="0.85"
            />
            <path
              d="M320 0 C 420 160, 260 340, 360 500 C 420 600, 520 650, 700 700 L 700 0 Z"
              fill="#d0e5fc"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="forgot-container">
          {/* Left/Center Column: White Forgot Password Card */}
          <section className="forgot-card">
            <h1 className="forgot-card__title">Forgot Password?</h1>
            <p className="forgot-card__subtitle">
              Don't worry! Enter your registered email address and we'll send you a link to reset your password.
            </p>

            <form className="forgot-form" onSubmit={handleSubmit} id="forgot-password-form">
              <div className="forgot-field">
                <label htmlFor="forgot-email" className="forgot-field__label">
                  Email Address
                </label>
                <div className="forgot-field__input-wrap">
                  <span className="forgot-field__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="forgot-field__input"
                  />
                </div>
                <span className="forgot-field__help">
                  Use the email address associated with your JobRisers account.
                </span>
              </div>

              {notice && (
                <div className={`signup-alert signup-alert--${notice.type === 'success' ? 'info' : 'error'}`} style={{ marginBottom: '18px' }}>
                  {notice.message}
                </div>
              )}

              <button type="submit" className="forgot-submit-btn" id="forgot-submit-btn">
                Send Reset Link
              </button>

              <div className="forgot-back-row">
                <Link to="/login" className="forgot-back-link" id="forgot-back-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          </section>

          {/* Right Column: Password Reset Illustration (Image 2 Match) */}
          <section className="forgot-illustration" aria-hidden="true">
            <div className="forgot-illustration__wrapper">
              <svg viewBox="0 0 460 420" fill="none" className="forgot-illustration__svg">
                {/* Background soft ambient card blur/glow */}
                <rect x="30" y="40" width="360" height="320" rx="24" fill="#93c5fd" opacity="0.4" filter="blur(16px)" />

                {/* Main Account / Browser Card */}
                <rect x="40" y="45" width="350" height="300" rx="20" fill="#9bc6fa" />

                {/* Top header bar */}
                <path d="M40 65 C40 53.9543 48.9543 45 60 45 L370 45 C381.046 45 390 53.9543 390 65 L390 95 L40 95 Z" fill="#4d92ea" />

                {/* User avatar circle */}
                <circle cx="215" cy="165" r="46" fill="#2563eb" />
                {/* User avatar head */}
                <circle cx="215" cy="153" r="16" fill="#9bc6fa" />
                {/* User avatar shoulders */}
                <path d="M185 198 C185 180 200 174 215 174 C230 174 245 180 245 198 Z" fill="#9bc6fa" />

                {/* First horizontal bar below avatar */}
                <rect x="135" y="232" width="160" height="18" rx="9" fill="#4d92ea" />

                {/* Asterisks password bar below */}
                <rect x="110" y="266" width="210" height="26" rx="13" fill="#6ba7f2" />
                {/* Asterisk 1 */}
                <g transform="translate(160, 279)" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="-3.5" y1="-5.2" x2="3.5" y2="5.2" />
                  <line x1="-3.5" y1="5.2" x2="3.5" y2="-5.2" />
                </g>
                {/* Asterisk 2 */}
                <g transform="translate(195, 279)" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="-3.5" y1="-5.2" x2="3.5" y2="5.2" />
                  <line x1="-3.5" y1="5.2" x2="3.5" y2="-5.2" />
                </g>
                {/* Asterisk 3 */}
                <g transform="translate(230, 279)" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="-3.5" y1="-5.2" x2="3.5" y2="5.2" />
                  <line x1="-3.5" y1="5.2" x2="3.5" y2="-5.2" />
                </g>
                {/* Asterisk 4 */}
                <g transform="translate(265, 279)" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round">
                  <line x1="-6" y1="0" x2="6" y2="0" />
                  <line x1="-3.5" y1="-5.2" x2="3.5" y2="5.2" />
                  <line x1="-3.5" y1="5.2" x2="3.5" y2="-5.2" />
                </g>

                {/* 3D Blue Padlock on the bottom right corner */}
                <g transform="translate(340, 240)">
                  {/* Padlock Shackle Loop */}
                  <path
                    d="M18 42 V22 C18 9 32 -1 46 -1 C60 -1 74 9 74 22 V42"
                    fill="none"
                    stroke="#a8cbf8"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                  {/* Padlock Body */}
                  <rect x="0" y="38" width="92" height="80" rx="14" fill="#2563eb" />
                  {/* Padlock Highlight sheen on left */}
                  <path d="M4 48 C4 42 8 38 14 38 L30 38 L14 114 C8 114 4 110 4 104 Z" fill="#3b82f6" opacity="0.6" />
                  {/* Keyhole Circle */}
                  <circle cx="46" cy="72" r="7.5" fill="#1e3a8a" />
                  {/* Keyhole Slot */}
                  <polygon points="43,72 49,72 52,90 40,90" fill="#1e3a8a" />
                </g>
              </svg>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
