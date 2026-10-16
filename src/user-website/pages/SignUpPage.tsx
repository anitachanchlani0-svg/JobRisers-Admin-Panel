import { useState, type FormEvent } from 'react'
import '../styles/signup.css'

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<'seeker' | 'employer'>('seeker')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState<{ type: 'info' | 'error'; message: string } | null>(null)

  // Password rules validation
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !password) {
      setNotice({ type: 'error', message: 'Please fill in all required fields.' })
      return
    }

    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      setNotice({ type: 'error', message: 'Please meet all password requirements before proceeding.' })
      return
    }

    // UI-only validation feedback (no backend pretend registration)
    setNotice({
      type: 'info',
      message: `Account details validated for ${fullName.trim()} (${accountType === 'seeker' ? 'Job Seeker' : 'Employer'}). Registration APIs will be connected in an upcoming phase.`,
    })
  }

  const handleSocialClick = (provider: string) => {
    setNotice({
      type: 'info',
      message: `${provider} authentication will be connected once OAuth backend integration is available.`,
    })
  }

  return (
    <div className="signup-page">
      {/* --------------------------------------------
          Top Navigation Bar
          -------------------------------------------- */}
      <header className="signup-nav">
        <div className="signup-nav__container">
          {/* Logo */}
          <a href="/" className="signup-nav__logo" id="signup-logo">
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
          </a>

          {/* Center Links */}
          <nav className="signup-nav__links">
            <a href="/jobs">Jobs</a>
            <a href="/companies">Companies</a>
            <a href="/#career-advice">Career Advice</a>
            <a href="/#for-employers">For Employers</a>
          </nav>

          {/* Right Auth Link */}
          <div className="signup-nav__auth">
            <span className="signup-nav__auth-label">Already have an account?</span>
            <a href="/admin/login" className="signup-nav__signin-btn" id="signup-signin-btn">
              Sign in
            </a>
          </div>
        </div>
      </header>

      {/* --------------------------------------------
          Main 3-Column Content
          -------------------------------------------- */}
      <main className="signup-main">
        {/* Left Column: Intro & Features */}
        <section className="signup-intro">
          <p className="signup-intro__eyebrow">JOIN A BRIGHTER TOMORROW</p>
          <h1 className="signup-intro__title">Create Your Account</h1>
          <p className="signup-intro__subtitle">
            Take the next step in your career. It’s quick, free, and easy.
          </p>

          <div className="signup-features">
            {/* Feature 1 */}
            <div className="signup-feature-row">
              <div className="signup-feature-row__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="signup-feature-row__content">
                <span className="signup-feature-row__title">Access thousands of jobs</span>
                <span className="signup-feature-row__desc">Find opportunities from top companies</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="signup-feature-row">
              <div className="signup-feature-row__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
              </div>
              <div className="signup-feature-row__content">
                <span className="signup-feature-row__title">Get personalized recommendations</span>
                <span className="signup-feature-row__desc">Jobs that match your skills and goals</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="signup-feature-row">
              <div className="signup-feature-row__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="18" x2="18" y1="20" y2="10" />
                  <line x1="12" x2="12" y1="20" y2="4" />
                  <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
              </div>
              <div className="signup-feature-row__content">
                <span className="signup-feature-row__title">Track your progress</span>
                <span className="signup-feature-row__desc">Manage applications and stay updated</span>
              </div>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="signup-testimonial">
            <div className="signup-testimonial__quote-mark">“</div>
            <p className="signup-testimonial__quote">
              JobNest made my job search simple and stress-free. I found the right role in just 3 weeks!
            </p>
            <p className="signup-testimonial__author">— Priya S., Product Designer</p>
          </div>

          {/* Bottom Stats */}
          <div className="signup-stats">
            <div className="signup-stat-item">
              <span className="signup-stat-item__value">50K+</span>
              <span className="signup-stat-item__label">Active Jobs</span>
            </div>
            <div className="signup-stat-item">
              <span className="signup-stat-item__value">10K+</span>
              <span className="signup-stat-item__label">Companies</span>
            </div>
            <div className="signup-stat-item">
              <span className="signup-stat-item__value">1M+</span>
              <span className="signup-stat-item__label">Job Seekers</span>
            </div>
            <div className="signup-stat-item">
              <span className="signup-stat-item__value">95%</span>
              <span className="signup-stat-item__label">Success Stories</span>
            </div>
          </div>
        </section>

        {/* Center Column: Hero Person */}
        <section className="signup-hero">
          {/* Decorative Arch Backdrop */}
          <div className="signup-hero__backdrop" />

          {/* Person Image */}
          <img
            src="/hero-student-realistic.png"
            alt="Young professional holding laptop, ready for career growth"
            className="signup-hero__image"
            loading="eager"
          />

          {/* Handwritten message on right of shoulder */}
          <div className="signup-hero__handwritten">
            <div className="signup-hero__handwritten-text">
              Your<br />
              Future<br />
              Starts<br />
              Here
            </div>
            <svg viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M30 4 C 20 12, 10 22, 4 22" />
              <path d="M 12 16 L 4 22 L 10 26" />
            </svg>
          </div>

          {/* Bottom Social Proof Pill */}
          <div className="signup-hero__social-proof">
            <img
              src="/avatars-cluster.png"
              alt="Community members"
              className="signup-hero__avatars-img"
            />
            <span className="signup-hero__social-text">
              Join thousands of professionals already growing with JobNest
            </span>
          </div>
        </section>

        {/* Right Column: Create an Account Form Card */}
        <section className="signup-card">
          <h2 className="signup-card__title">Create an Account</h2>
          <p className="signup-card__subtitle">Choose your account type to get started</p>

          {/* Account Type Selector */}
          <div className="signup-account-types">
            <button
              type="button"
              className={`signup-type-btn ${accountType === 'seeker' ? 'signup-type-btn--active' : ''}`}
              onClick={() => setAccountType('seeker')}
              id="type-job-seeker"
            >
              <div className="signup-type-btn__icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="signup-type-btn__text">
                <span className="signup-type-btn__title">Job Seeker</span>
                <span className="signup-type-btn__desc">Find and apply for jobs</span>
              </div>
            </button>

            <button
              type="button"
              className={`signup-type-btn ${accountType === 'employer' ? 'signup-type-btn--active' : ''}`}
              onClick={() => setAccountType('employer')}
              id="type-employer"
            >
              <div className="signup-type-btn__icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M8 10h.01" />
                  <path d="M16 10h.01" />
                  <path d="M8 14h.01" />
                  <path d="M16 14h.01" />
                </svg>
              </div>
              <div className="signup-type-btn__text">
                <span className="signup-type-btn__title">Employer</span>
                <span className="signup-type-btn__desc">Hire top talent</span>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Full Name */}
            <div className="signup-field">
              <label htmlFor="signup-name" className="signup-field__label">Full Name</label>
              <div className="signup-field__input-wrap">
                <span className="signup-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="signup-field__input"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="signup-field">
              <label htmlFor="signup-email" className="signup-field__label">Email Address</label>
              <div className="signup-field__input-wrap">
                <span className="signup-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="signup-field__input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="signup-field">
              <label htmlFor="signup-password" className="signup-field__label">Password</label>
              <div className="signup-field__input-wrap">
                <span className="signup-field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="signup-field__input signup-field__input--has-toggle"
                />
                <button
                  type="button"
                  className="signup-field__toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Validation Guidance */}
            <div className="signup-pw-rules">
              <div className={`signup-pw-rule ${hasMinLength ? 'signup-pw-rule--valid' : ''}`}>
                <span className="signup-pw-rule__indicator">{hasMinLength ? '✓' : ''}</span>
                <span>At least 8 characters</span>
              </div>
              <div className={`signup-pw-rule ${hasNumber ? 'signup-pw-rule--valid' : ''}`}>
                <span className="signup-pw-rule__indicator">{hasNumber ? '✓' : ''}</span>
                <span>Include a number</span>
              </div>
              <div className={`signup-pw-rule ${hasSpecialChar ? 'signup-pw-rule--valid' : ''}`}>
                <span className="signup-pw-rule__indicator">{hasSpecialChar ? '✓' : ''}</span>
                <span>Include a special character</span>
              </div>
            </div>

            {/* Notice / Feedback Banner */}
            {notice && (
              <div className={`signup-alert signup-alert--${notice.type}`}>
                {notice.message}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="signup-submit-btn" id="signup-submit-btn">
              <span>Create Account</span>
              <span>→</span>
            </button>
          </form>

          {/* Divider */}
          <div className="signup-divider">
            <span>or sign up with</span>
          </div>

          {/* Social Sign-up Buttons */}
          <div className="signup-social-row">
            {/* Google */}
            <button
              type="button"
              className="signup-social-btn"
              onClick={() => handleSocialClick('Google')}
              id="signup-google-btn"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              className="signup-social-btn"
              onClick={() => handleSocialClick('LinkedIn')}
              id="signup-linkedin-btn"
            >
              <svg viewBox="0 0 24 24" fill="#0A66C2" width="16" height="16">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.72a1.63 1.63 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.89-.73-1.62-1.63-1.62z" />
              </svg>
              <span>LinkedIn</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              className="signup-social-btn"
              onClick={() => handleSocialClick('Apple')}
              id="signup-apple-btn"
            >
              <svg viewBox="0 0 24 24" fill="#000000" width="15" height="15">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.79 1.09-1.89.97-2.89-.94.04-2.07.63-2.74 1.41-.58.68-1.1 1.77-.96 2.85 1.04.08 2.1-.58 2.73-1.37z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Footer Disclaimer */}
          <p className="signup-disclaimer">
            By creating an account, you agree to our{' '}
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </p>
        </section>
      </main>
    </div>
  )
}
