import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/settings.css'

export default function AccountSettingsPage() {
  const navigate = useNavigate()

  // Tab state
  const [activeTab, setActiveTab] = useState<'Account' | 'Notifications' | 'Privacy' | 'Deactivate'>('Account')

  // Form states
  const [email, setEmail] = useState('alex.johnson@gmail.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Feedback states
  const [emailSaved, setEmailSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  // Notification toggles state (Exact initial states from reference screenshot)
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    interviewReminders: true,
    messages: true,
    productUpdates: false,
    promotionalEmails: false,
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSaved(true)
    setTimeout(() => setEmailSaved(false), 2500)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  return (
    <div className="settings-page-root">
      {/* ------------------------------------------------------------------
          Top Navigation Bar (Matches Reference Screenshot)
          ------------------------------------------------------------------ */}
      <header className="settings-nav" id="settings-header-nav">
        <div className="settings-nav__container">
          {/* Left: Logo and Search Bar */}
          <div className="settings-nav__left">
            <Link to="/" className="settings-nav__logo" id="settings-nav-logo">
              <img
                src="/jobrisers-logo.svg"
                alt="JobRisers"
                width="30"
                height="30"
                className="settings-nav__logo-img"
              />
              <span className="settings-nav__logo-text">
                <span className="settings-nav__logo-text--job">Job</span>
                <span className="settings-nav__logo-text--risers">Risers</span>
              </span>
            </Link>

            <div className="settings-nav__search">
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="settings-nav__search-input"
                id="navbar-search-input"
              />
            </div>
          </div>

          {/* Right: Navigation Links, Notification Indicator, User Profile */}
          <div className="settings-nav__right">
            <nav className="settings-nav__links">
              <Link to="/jobs" className="settings-nav__link" id="nav-jobs">
                Jobs
              </Link>
              <Link to="/companies" className="settings-nav__link" id="nav-companies">
                Companies
              </Link>
              <Link to="/#career-advice" className="settings-nav__link" id="nav-career-advice">
                Career Advice
              </Link>
            </nav>

            <div className="settings-nav__user-wrap">
              {/* Notification Indicator Dot */}
              <div className="settings-nav__notif-dot" aria-label="New notification" />

              {/* Logged in User */}
              <Link
                to="/settings"
                className="settings-nav__user"
                id="user-profile-badge"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="settings-nav__avatar" aria-hidden="true">
                  AJ
                </div>
                <span className="settings-nav__username">Alex Johnson</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          Main Three-Column Layout Container
          ------------------------------------------------------------------ */}
      <div className="settings-body">
        <div className="settings-body__container">
          {/* ================================================================
              LEFT COLUMN — NAVIGATION SIDEBAR
              ================================================================ */}
          <aside className="settings-sidebar-left" aria-label="Account Navigation">
            <nav className="settings-menu">
              <button
                type="button"
                className="settings-menu__item"
                onClick={() => navigate('/#profile')}
              >
                Profile
              </button>

              <button
                type="button"
                className="settings-menu__item"
                onClick={() => navigate('/jobs')}
              >
                Find Jobs
              </button>

              <button
                type="button"
                className="settings-menu__item"
                onClick={() => navigate('/#applications')}
              >
                Applications
              </button>

              <button
                type="button"
                className="settings-menu__item"
                onClick={() => navigate('/#saved-jobs')}
              >
                Saved Jobs
              </button>

              <button
                type="button"
                className="settings-menu__item"
                onClick={() => navigate('/interviews')}
              >
                Interviews
              </button>

              <button
                type="button"
                className="settings-menu__item settings-menu__item--has-badge"
                onClick={() => navigate('/messages')}
              >
                <span>Messages</span>
                <span className="settings-menu__badge">3</span>
              </button>

              <button
                type="button"
                className="settings-menu__item settings-menu__item--active"
                onClick={() => setActiveTab('Account')}
              >
                Settings
              </button>
            </nav>

            {/* Upgrade to Premium Card at Bottom */}
            <div className="settings-upgrade-card" id="upgrade-premium-card">
              <h4 className="settings-upgrade-card__title">Upgrade to Premium</h4>
              <p className="settings-upgrade-card__desc">
                Get early access to top jobs, career insights and more.
              </p>
              <button
                type="button"
                className="settings-upgrade-card__btn"
                id="upgrade-premium-btn"
              >
                Upgrade
              </button>
            </div>
          </aside>

          {/* ================================================================
              MIDDLE COLUMN — MAIN ACCOUNT SETTINGS CONTENT
              ================================================================ */}
          <main className="settings-main-content">
            {/* Page Header */}
            <header className="settings-header">
              <h1 className="settings-header__title">Account Settings</h1>
              <p className="settings-header__subtitle">
                Manage your account, security, and preferences.
              </p>
            </header>

            {/* Navigation Tabs */}
            <div className="settings-tabs" role="tablist">
              {(['Account', 'Notifications', 'Privacy', 'Deactivate'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`settings-tab ${activeTab === tab ? 'settings-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  id={`tab-${tab.toLowerCase()}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents: Primary Account Tab matching Screenshot */}
            <div className="settings-cards-stack">
              {/* ------------------------------------------------------------
                  CARD 1: Email Address
                  ------------------------------------------------------------ */}
              <section className="settings-card" id="email-address-card">
                <div className="settings-card__header">
                  <div className="settings-card__title-group">
                    <div className="settings-card__icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="settings-card__title">Email Address</h2>
                      <p className="settings-card__subtitle">
                        Update your email address used for login and communications.
                      </p>
                    </div>
                  </div>

                  <span className="settings-badge settings-badge--verified" id="badge-email-verified">
                    Verified
                  </span>
                </div>

                <form onSubmit={handleSaveEmail} className="settings-card__body">
                  <div className="settings-field settings-field--inline">
                    <label htmlFor="email-input" className="settings-field__label">
                      Email address
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="settings-field__input settings-field__input--email"
                      required
                    />
                  </div>

                  <div className="settings-card__footer">
                    {emailSaved && (
                      <span className="settings-card__feedback-msg">
                        Email saved successfully!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="settings-btn settings-btn--primary"
                      id="save-email-btn"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </section>

              {/* ------------------------------------------------------------
                  CARD 2: Password
                  ------------------------------------------------------------ */}
              <section className="settings-card" id="password-card">
                <div className="settings-card__header">
                  <div className="settings-card__title-group">
                    <div className="settings-card__icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="settings-card__title">Password</h2>
                      <p className="settings-card__subtitle">
                        Change your password to keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSavePassword} className="settings-card__body">
                  <div className="settings-password-grid">
                    {/* Left Form Inputs */}
                    <div className="settings-password-inputs">
                      <div className="settings-field">
                        <label htmlFor="current-password-input" className="settings-field__label">
                          Current password
                        </label>
                        <input
                          id="current-password-input"
                          type="password"
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="settings-field__input"
                        />
                      </div>

                      <div className="settings-password-row">
                        <div className="settings-field">
                          <label htmlFor="new-password-input" className="settings-field__label">
                            New password
                          </label>
                          <input
                            id="new-password-input"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="settings-field__input"
                          />
                        </div>

                        <div className="settings-field">
                          <label htmlFor="confirm-password-input" className="settings-field__label">
                            Confirm new password
                          </label>
                          <input
                            id="confirm-password-input"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="settings-field__input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Password Requirements Panel */}
                    <aside className="settings-req-panel" aria-label="Password requirements">
                      <h3 className="settings-req-panel__title">Password requirements:</h3>
                      <ul className="settings-req-panel__list">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                        <li>One special character (e.g. !@#$)</li>
                      </ul>
                    </aside>
                  </div>

                  <div className="settings-card__footer">
                    {passwordSaved && (
                      <span className="settings-card__feedback-msg">
                        Password updated!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="settings-btn settings-btn--primary"
                      id="save-password-btn"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </section>

              {/* ------------------------------------------------------------
                  CARD 3: Notification Preferences
                  ------------------------------------------------------------ */}
              <section className="settings-card" id="notification-preferences-card">
                <div className="settings-card__header">
                  <div className="settings-card__title-group">
                    <div className="settings-card__icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="settings-card__title">Notification Preferences</h2>
                      <p className="settings-card__subtitle">
                        Choose what notifications you want to receive.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="settings-notif-list">
                  {/* 1. Job alerts */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.jobAlerts}
                      className={`settings-toggle ${notifications.jobAlerts ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('jobAlerts')}
                      id="toggle-job-alerts"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Job alerts</span>
                    <span className="settings-notif-desc">
                      Get notified about new job postings that match your preferences.
                    </span>
                  </div>

                  {/* 2. Application updates */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.applicationUpdates}
                      className={`settings-toggle ${notifications.applicationUpdates ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('applicationUpdates')}
                      id="toggle-application-updates"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Application updates</span>
                    <span className="settings-notif-desc">
                      Get notified when there's an update on your applications.
                    </span>
                  </div>

                  {/* 3. Interview reminders */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.interviewReminders}
                      className={`settings-toggle ${notifications.interviewReminders ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('interviewReminders')}
                      id="toggle-interview-reminders"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Interview reminders</span>
                    <span className="settings-notif-desc">
                      Receive reminders before your scheduled interviews.
                    </span>
                  </div>

                  {/* 4. Messages */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.messages}
                      className={`settings-toggle ${notifications.messages ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('messages')}
                      id="toggle-messages"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Messages</span>
                    <span className="settings-notif-desc">
                      Get notified about new messages from employers.
                    </span>
                  </div>

                  {/* 5. Product updates */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.productUpdates}
                      className={`settings-toggle ${notifications.productUpdates ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('productUpdates')}
                      id="toggle-product-updates"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Product updates</span>
                    <span className="settings-notif-desc">
                      Receive updates about new features and improvements.
                    </span>
                  </div>

                  {/* 6. Promotional emails */}
                  <div className="settings-notif-row">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications.promotionalEmails}
                      className={`settings-toggle ${notifications.promotionalEmails ? 'settings-toggle--on' : ''}`}
                      onClick={() => toggleNotification('promotionalEmails')}
                      id="toggle-promotional-emails"
                    >
                      <span className="settings-toggle__handle" />
                    </button>
                    <span className="settings-notif-label">Promotional emails</span>
                    <span className="settings-notif-desc">
                      Receive tips, career advice and promotional content.
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </main>

          {/* ================================================================
              RIGHT COLUMN — ACCOUNT METADATA & QUICK ACTIONS SIDEBAR
              ================================================================ */}
          <aside className="settings-sidebar-right" aria-label="Account Overview and Actions">
            {/* 1. Your account Card */}
            <div className="settings-right-card" id="your-account-widget">
              <h3 className="settings-right-card__header-title">Your account</h3>

              <div className="settings-account-user">
                <div className="settings-account-user__avatar" aria-hidden="true">
                  AJ
                </div>
                <div className="settings-account-user__info">
                  <span className="settings-account-user__name">Alex Johnson</span>
                  <span className="settings-account-user__email">alex.johnson@gmail.com</span>
                  <button
                    type="button"
                    className="settings-account-user__link"
                    onClick={() => navigate('/#profile')}
                  >
                    View public profile
                  </button>
                </div>
              </div>

              <div className="settings-right-card__divider" />

              <div className="settings-meta-row">
                <span className="settings-meta-label">Member since</span>
                <span className="settings-meta-value">Mar 2024</span>
              </div>

              <div className="settings-meta-row">
                <span className="settings-meta-label">Account status</span>
                <span className="settings-badge settings-badge--active" id="badge-account-status">
                  Active
                </span>
              </div>
            </div>

            {/* 2. Keep your account secure Card */}
            <div className="settings-action-card settings-action-card--blue" id="card-account-secure">
              <div className="settings-action-card__circle settings-action-card__circle--blue" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <div className="settings-action-card__content">
                <h4 className="settings-action-card__title">Keep your account secure</h4>
                <p className="settings-action-card__desc">
                  Use a strong password and enable notifications to stay informed.
                </p>
              </div>
            </div>

            {/* 3. Privacy & Data Card */}
            <div className="settings-action-card" id="card-privacy-data">
              <div className="settings-action-card__circle" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20" />
                  <path d="M20 12v8H4v-8" />
                  <path d="m4 4 16 16" />
                </svg>
              </div>
              <div className="settings-action-card__content">
                <h4 className="settings-action-card__title">Privacy &amp; Data</h4>
                <p className="settings-action-card__desc">
                  Manage your privacy settings and control your data.
                </p>
              </div>
            </div>

            {/* 4. Deactivate account Card */}
            <div className="settings-action-card settings-action-card--danger" id="card-deactivate-account">
              <div className="settings-action-card__circle settings-action-card__circle--danger" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <div className="settings-action-card__content">
                <h4 className="settings-action-card__title settings-action-card__title--danger">
                  Deactivate account
                </h4>
                <p className="settings-action-card__desc">
                  Temporarily or permanently deactivate your account.
                </p>
              </div>
            </div>

            {/* 5. Log out Card */}
            <div className="settings-action-card" id="card-log-out">
              <div className="settings-action-card__circle" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div className="settings-action-card__content">
                <h4 className="settings-action-card__title">Log out</h4>
                <p className="settings-action-card__desc">
                  Sign out from your account on this device.
                </p>
              </div>
            </div>

            {/* 6. Need help? Card */}
            <div className="settings-help-card" id="card-need-help">
              <div className="settings-help-card__header">
                <div className="settings-help-card__icon" aria-hidden="true">
                  ?
                </div>
                <h4 className="settings-help-card__title">Need help?</h4>
              </div>

              <p className="settings-help-card__desc">
                If you have any questions, visit our Help Center or contact support.
              </p>

              <div className="settings-help-card__links">
                <button
                  type="button"
                  className="settings-help-card__link"
                  onClick={() => navigate('/#help-center')}
                >
                  Visit Help Center
                </button>
                <button
                  type="button"
                  className="settings-help-card__link"
                  onClick={() => navigate('/#contact-support')}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
