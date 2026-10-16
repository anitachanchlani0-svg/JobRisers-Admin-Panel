import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/interviews.css'

interface UpcomingInterview {
  id: string
  company: string
  role: string
  date: string
  time: string
  format: 'Video Interview' | 'On-site'
  status: 'Scheduled' | 'Confirmed'
  meetingLink?: string
  location?: string
  interviewerName: string
  interviewerRole: string
  primaryAction: 'Join Meeting' | 'View Details'
  primaryActionUrl?: string
}

interface PastInterview {
  id: string
  company: string
  companyLogoType: 'amazon' | 'spotify' | 'atlassian'
  role: string
  date: string
  time: string
  format: 'Video' | 'On-site'
  status: 'Completed' | 'Not Selected'
  actionText: 'View Feedback' | 'View Details'
}

export default function InterviewsPage() {
  const navigate = useNavigate()

  // Tab state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  // Sort state
  const [sortBy, setSortBy] = useState('Date (soonest)')
  const [sortOpen, setSortOpen] = useState(false)

  // Pagination state for past interviews
  const [pastPage, setPastPage] = useState(1)

  // Modal / Toast interactive states
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Upcoming Interviews Data (exact from screenshot)
  const upcomingInterviews: UpcomingInterview[] = [
    {
      id: 'google-interview',
      company: 'Google',
      role: 'Product Designer',
      date: 'Tue, 19 Mar 2024',
      time: '10:00 AM – 11:00 AM',
      format: 'Video Interview',
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-nij',
      interviewerName: 'Priya Sharma',
      interviewerRole: 'Senior Product Designer',
      primaryAction: 'Join Meeting',
      primaryActionUrl: 'https://meet.google.com/abc-defg-nij',
    },
    {
      id: 'microsoft-interview',
      company: 'Microsoft',
      role: 'UX Designer',
      date: 'Thu, 21 Mar 2024',
      time: '02:00 PM – 03:00 PM',
      format: 'On-site',
      status: 'Confirmed',
      location: 'Microsoft India Development Center, Hyderabad, India',
      interviewerName: 'Rohit Menon',
      interviewerRole: 'Design Manager',
      primaryAction: 'View Details',
    },
    {
      id: 'adobe-interview',
      company: 'Adobe',
      role: 'Product Designer',
      date: 'Mon, 25 Mar 2024',
      time: '11:30 AM – 12:30 PM',
      format: 'Video Interview',
      status: 'Scheduled',
      meetingLink: 'https://adobe.zoom.us/j/987654321',
      interviewerName: 'Emily Carter',
      interviewerRole: 'Lead Product Designer',
      primaryAction: 'Join Meeting',
      primaryActionUrl: 'https://adobe.zoom.us/j/987654321',
    },
  ]

  // Past Interviews Data (exact from screenshot)
  const pastInterviews: PastInterview[] = [
    {
      id: 'amazon-interview',
      company: 'Amazon',
      companyLogoType: 'amazon',
      role: 'UX Designer',
      date: '12 Mar 2024',
      time: '10:00 AM – 11:00 AM',
      format: 'Video',
      status: 'Completed',
      actionText: 'View Feedback',
    },
    {
      id: 'spotify-interview',
      company: 'Spotify',
      companyLogoType: 'spotify',
      role: 'Product Designer',
      date: '5 Mar 2024',
      time: '03:00 PM – 04:00 PM',
      format: 'Video',
      status: 'Completed',
      actionText: 'View Feedback',
    },
    {
      id: 'atlassian-interview',
      company: 'Atlassian',
      companyLogoType: 'atlassian',
      role: 'UI Designer',
      date: '28 Feb 2024',
      time: '11:00 AM – 12:00 PM',
      format: 'On-site',
      status: 'Not Selected',
      actionText: 'View Details',
    },
  ]

  // Render company logos in table exactly matching reference
  const renderTableCompanyLogo = (type: 'amazon' | 'spotify' | 'atlassian') => {
    if (type === 'amazon') {
      return (
        <span className="interview-table-logo interview-table-logo--amazon" aria-label="Amazon logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M13.8 17.5c-3.8 2.8-9.4 4.3-13.8 2.3-.2-.1-.2-.4 0-.5 3-2.1 7.4-3.5 11.8-3.5 1 0 2 .1 3 .3.3.1.3.4-.1.4"
              fill="#FF9900"
            />
            <path
              d="M14.7 16.2c-.3-.4-1.9-.2-2.7-.1-.2 0-.3-.2-.1-.3 1.2-.9 3.2-.6 3.5-.2.3.4 0 2.4-1.1 3.4-.2.2-.4.1-.3-.1.4-.7.9-2.3.7-2.7"
              fill="#FF9900"
            />
            <path
              d="M11.5 5.5c-2.8 0-4.8 1.8-4.8 4.2 0 2.2 1.5 3.5 3.6 3.5 1.5 0 2.7-.8 3.3-1.8v1.6h2.1V5.8h-2.1v1.4c-.6-1-1.8-1.7-2.1-1.7zm.3 6c-1.3 0-2.3-.9-2.3-2.3 0-1.4 1-2.4 2.3-2.4 1.3 0 2.2 1 2.2 2.4 0 1.4-.9 2.3-2.2 2.3z"
              fill="#111827"
            />
          </svg>
        </span>
      )
    }
    if (type === 'spotify') {
      return (
        <span className="interview-table-logo interview-table-logo--spotify" aria-label="Spotify logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
            <circle cx="12" cy="12" r="11" fill="#1DB954" />
            <path
              d="M7 8.5c3.5-1 7.2-.7 10.5.8M7.8 11.8c2.8-.8 6-.6 8.8.6M8.6 15.1c2.2-.5 4.7-.4 6.9.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )
    }
    return (
      <span className="interview-table-logo interview-table-logo--atlassian" aria-label="Atlassian logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M11.7 13.1c-.3-.4-.7-.6-1.2-.6H6.1c-.5 0-.9.4-.9.9 0 4.8 3.9 8.7 8.7 8.7.5 0 .9-.4.9-.9v-4.4c0-.5-.2-1-.5-1.3l-2.6-2.4z"
            fill="#0052CC"
          />
          <path
            d="M12.3 10.9c.3.4.7.6 1.2.6h4.4c.5 0 .9-.4.9-.9 0-4.8-3.9-8.7-8.7-8.7-.5 0-.9.4-.9.9v4.4c0 .5.2 1 .5 1.3l2.6 2.4z"
            fill="#2684FF"
          />
        </svg>
      </span>
    )
  }

  return (
    <div className="interviews-page-root">
      {/* ------------------------------------------------------------------
          Top Navigation Bar (Exact Match to Screenshot)
          ------------------------------------------------------------------ */}
      <header className="interviews-nav" id="interviews-header-nav">
        <div className="interviews-nav__container">
          {/* Left: JobRisers Brand Logo */}
          <div className="interviews-nav__left">
            <Link to="/" className="interviews-nav__logo" id="interviews-nav-logo">
              <span className="interviews-nav__logo-badge">
                <span className="interviews-nav__logo-badge-text">J</span>
                <span className="interviews-nav__logo-badge-sub">JobRisers</span>
              </span>
              <span className="interviews-nav__logo-text">
                <span className="interviews-nav__logo-text--job">Job</span>
                <span className="interviews-nav__logo-text--risers">Risers</span>
              </span>
            </Link>

            {/* Search Input Bar */}
            <div className="interviews-nav__search">
              <svg
                className="interviews-nav__search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="interviews-nav__search-input"
                id="navbar-search-input"
              />
            </div>
          </div>

          {/* Right: Nav Links and User Profile Dropdown */}
          <div className="interviews-nav__right">
            <nav className="interviews-nav__links">
              <Link to="/jobs" className="interviews-nav__link" id="nav-jobs">
                Jobs
              </Link>
              <Link to="/companies" className="interviews-nav__link" id="nav-companies">
                Companies
              </Link>
              <Link to="/#career-advice" className="interviews-nav__link" id="nav-career-advice">
                Career Advice
              </Link>
            </nav>

            {/* User Dropdown */}
            <div className="interviews-nav__user-dropdown" id="nav-user-dropdown">
              <span className="interviews-nav__username">Alex Johnson</span>
              <svg
                className="interviews-nav__user-chevron"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          Main Three-Column Layout Container
          ------------------------------------------------------------------ */}
      <div className="interviews-body">
        <div className="interviews-body__container">
          {/* ================================================================
              LEFT COLUMN — SIDEBAR NAVIGATION
              ================================================================ */}
          <aside className="interviews-sidebar-left" aria-label="Portal Navigation">
            <nav className="interviews-menu">
              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/')}
                id="menu-home"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/jobs')}
                id="menu-find-jobs"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Find Jobs</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/#applications')}
                id="menu-applications"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="7" y1="8" x2="17" y2="8" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="7" y1="16" x2="13" y2="16" />
                </svg>
                <span>Applications</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/#saved-jobs')}
                id="menu-saved-jobs"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="7" x2="12" y2="13" />
                  <line x1="9" y1="10" x2="15" y2="10" />
                </svg>
                <span>Saved Jobs</span>
              </button>

              {/* ACTIVE ITEM: Interviews */}
              <button
                type="button"
                className="interviews-menu__item interviews-menu__item--active"
                onClick={() => setActiveTab('upcoming')}
                id="menu-interviews"
              >
                <svg className="interviews-menu__icon interviews-menu__icon--active" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
                <span>Interviews</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/#messages')}
                id="menu-messages"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Messages</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/#profile')}
                id="menu-profile"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
              </button>

              <button
                type="button"
                className="interviews-menu__item"
                onClick={() => navigate('/settings')}
                id="menu-settings"
              >
                <svg className="interviews-menu__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </button>
            </nav>

            {/* Upgrade to Premium Card */}
            <div className="interviews-upgrade-card" id="interviews-upgrade-card">
              <div className="interviews-upgrade-card__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#3b82f6">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </div>
              <h4 className="interviews-upgrade-card__title">Upgrade to Premium</h4>
              <p className="interviews-upgrade-card__desc">
                Get early access to top jobs, career insights and more.
              </p>
              <button
                type="button"
                className="interviews-upgrade-card__btn"
                id="upgrade-premium-btn"
                onClick={() => showToast('Premium subscription plans coming soon!')}
              >
                Upgrade
              </button>
            </div>
          </aside>

          {/* ================================================================
              MIDDLE COLUMN — MAIN CONTENT (Interviews Dashboard)
              ================================================================ */}
          <main className="interviews-main-content">
            {/* Page Header */}
            <header className="interviews-header">
              <h1 className="interviews-header__title">My Interviews</h1>
              <p className="interviews-header__subtitle">
                Stay on top of your upcoming interviews and track your progress.
              </p>
            </header>

            {/* Tabs & Sort Controls Row */}
            <div className="interviews-controls-row">
              <div className="interviews-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'upcoming'}
                  className={`interviews-tab ${activeTab === 'upcoming' ? 'interviews-tab--active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                  id="tab-upcoming"
                >
                  Upcoming (3)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'past'}
                  className={`interviews-tab ${activeTab === 'past' ? 'interviews-tab--active' : ''}`}
                  onClick={() => setActiveTab('past')}
                  id="tab-past"
                >
                  Past (5)
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="interviews-sort-wrap">
                <button
                  type="button"
                  className="interviews-sort-btn"
                  onClick={() => setSortOpen(!sortOpen)}
                  id="sort-interviews-btn"
                >
                  <span>Sort by: {sortBy}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="interviews-sort-menu">
                    {['Date (soonest)', 'Date (latest)', 'Company (A-Z)'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`interviews-sort-option ${sortBy === opt ? 'interviews-sort-option--active' : ''}`}
                        onClick={() => {
                          setSortBy(opt)
                          setSortOpen(false)
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 1: UPCOMING INTERVIEWS */}
            <section className="interviews-section" id="upcoming-interviews-section">
              <h2 className="interviews-section__title">Upcoming Interviews</h2>

              <div className="upcoming-cards-list">
                {upcomingInterviews.map((interview) => (
                  <article
                    key={interview.id}
                    className="upcoming-card"
                    id={`upcoming-card-${interview.id}`}
                  >
                    {/* Top Row: Info & Top Action Buttons */}
                    <div className="upcoming-card__top">
                      <div className="upcoming-card__info">
                        <h3 className="upcoming-card__company">{interview.company}</h3>
                        <div className="upcoming-card__role">{interview.role}</div>

                        {/* Meta row: Date, Time, Format */}
                        <div className="upcoming-card__meta">
                          <span className="upcoming-card__meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {interview.date}
                          </span>

                          <span className="upcoming-card__meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {interview.time}
                          </span>

                          <span className="upcoming-card__meta-item">
                            {interview.format === 'Video Interview' ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            )}
                            {interview.format}
                          </span>
                        </div>
                      </div>

                      {/* Right: Status badge and Actions */}
                      <div className="upcoming-card__actions-col">
                        <div className="upcoming-card__status-row">
                          <span
                            className={`upcoming-card__status-badge upcoming-card__status-badge--${interview.status.toLowerCase()}`}
                          >
                            {interview.status}
                          </span>
                        </div>

                        <div className="upcoming-card__buttons">
                          {interview.primaryAction === 'Join Meeting' ? (
                            <a
                              href={interview.primaryActionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="upcoming-card__btn upcoming-card__btn--primary"
                              id={`join-btn-${interview.id}`}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                              </svg>
                              Join Meeting
                            </a>
                          ) : (
                            <button
                              type="button"
                              className="upcoming-card__btn upcoming-card__btn--secondary"
                              onClick={() => setActiveModal(interview.id)}
                              id={`view-details-btn-${interview.id}`}
                            >
                              View Details
                            </button>
                          )}

                          <button
                            type="button"
                            className="upcoming-card__btn upcoming-card__btn--secondary"
                            onClick={() => showToast(`Added ${interview.company} interview to calendar!`)}
                            id={`calendar-btn-${interview.id}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Add to Calendar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Panel: Meeting Link / Location and Interviewer */}
                    <div className="upcoming-card__bottom-panel">
                      <div className="upcoming-card__bottom-left">
                        {interview.meetingLink ? (
                          <>
                            <span className="upcoming-card__panel-label">Meeting link</span>
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="upcoming-card__panel-link"
                            >
                              {interview.meetingLink}
                            </a>
                          </>
                        ) : (
                          <>
                            <span className="upcoming-card__panel-label">Location</span>
                            <span className="upcoming-card__panel-val">
                              {interview.location}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="upcoming-card__bottom-right">
                        <span className="upcoming-card__panel-label">Interviewer</span>
                        <div className="upcoming-card__interviewer-info">
                          <span className="upcoming-card__interviewer-name">
                            {interview.interviewerName}
                          </span>
                          <span className="upcoming-card__interviewer-role">
                            {interview.interviewerRole}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* SECTION 2: PAST INTERVIEWS TABLE */}
            <section className="interviews-section" id="past-interviews-section">
              <h2 className="interviews-section__title">Past Interviews</h2>

              <div className="past-interviews-table-wrap">
                <table className="past-interviews-table">
                  <thead>
                    <tr>
                      <th scope="col">Company</th>
                      <th scope="col">Role</th>
                      <th scope="col">Date & Time</th>
                      <th scope="col">Format</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastInterviews.map((item) => (
                      <tr key={item.id} id={`past-row-${item.id}`}>
                        {/* Company with Logo */}
                        <td className="past-table__company-cell">
                          {renderTableCompanyLogo(item.companyLogoType)}
                          <span className="past-table__company-name">{item.company}</span>
                        </td>

                        {/* Role */}
                        <td className="past-table__role-cell">{item.role}</td>

                        {/* Date & Time */}
                        <td className="past-table__datetime-cell">
                          <div className="past-table__date">{item.date}</div>
                          <div className="past-table__time">{item.time}</div>
                        </td>

                        {/* Format */}
                        <td className="past-table__format-cell">
                          <span className="past-table__format-badge">
                            {item.format === 'Video' ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            )}
                            {item.format}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="past-table__status-cell">
                          <span
                            className={`past-status-badge past-status-badge--${item.status === 'Completed' ? 'completed' : 'not-selected'}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="past-table__action-cell">
                          <button
                            type="button"
                            className="past-table__action-link"
                            onClick={() => setActiveModal(item.id)}
                            id={`action-btn-${item.id}`}
                          >
                            {item.actionText}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Bottom Pagination */}
              <div className="past-interviews-footer">
                <span className="past-interviews-showing">
                  Showing 1–3 of 5 interviews
                </span>

                <div className="past-pagination" aria-label="Past interviews pagination">
                  <button
                    type="button"
                    className="past-pagination__arrow"
                    onClick={() => setPastPage(Math.max(1, pastPage - 1))}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={`past-pagination__btn ${pastPage === 1 ? 'past-pagination__btn--active' : ''}`}
                    onClick={() => setPastPage(1)}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className={`past-pagination__btn ${pastPage === 2 ? 'past-pagination__btn--active' : ''}`}
                    onClick={() => setPastPage(2)}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="past-pagination__arrow"
                    onClick={() => setPastPage(Math.min(2, pastPage + 1))}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>
            </section>
          </main>

          {/* ================================================================
              RIGHT COLUMN — WIDGETS & RESOURCES SIDEBAR
              ================================================================ */}
          <aside className="interviews-sidebar-right" aria-label="Interview Resources">
            {/* Widget 1: Prepare for your interview */}
            <div className="interview-widget-card" id="widget-prepare">
              <div className="interview-widget__header">
                <div className="interview-widget__icon-square">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" fill="#2563eb" />
                  </svg>
                </div>
                <div>
                  <h3 className="interview-widget__title">Prepare for your interview</h3>
                  <p className="interview-widget__subtitle">
                    Tips and resources to help you perform your best.
                  </p>
                </div>
              </div>

              <div className="interview-widget__links-list">
                <a
                  href="#common-questions"
                  className="interview-widget__link-item"
                  onClick={(e) => {
                    e.preventDefault()
                    showToast('Opening Common Interview Questions guide...')
                  }}
                >
                  <span>Common interview questions</span>
                  <span className="interview-widget__arrow">→</span>
                </a>

                <a
                  href="#ace-interview"
                  className="interview-widget__link-item"
                  onClick={(e) => {
                    e.preventDefault()
                    showToast('Opening Product Design Interview guide...')
                  }}
                >
                  <span>How to ace a product design interview</span>
                  <span className="interview-widget__arrow">→</span>
                </a>

                <a
                  href="#virtual-tips"
                  className="interview-widget__link-item"
                  onClick={(e) => {
                    e.preventDefault()
                    showToast('Opening Virtual Interview Tips guide...')
                  }}
                >
                  <span>Virtual interview tips</span>
                  <span className="interview-widget__arrow">→</span>
                </a>
              </div>
            </div>

            {/* Widget 2: Upcoming this week */}
            <div className="interview-widget-card" id="widget-upcoming-week">
              <h3 className="interview-widget__title interview-widget__title--standalone">
                Upcoming this week
              </h3>

              <div className="upcoming-week-list">
                <div className="upcoming-week-item">
                  <div className="upcoming-week-item__text">
                    <div className="upcoming-week-item__company">Google</div>
                    <div className="upcoming-week-item__role">Product Designer</div>
                    <div className="upcoming-week-item__date">19 Mar 2024, 10:00 AM</div>
                  </div>
                  <span className="upcoming-week-item__chevron">›</span>
                </div>

                <div className="upcoming-week-item">
                  <div className="upcoming-week-item__text">
                    <div className="upcoming-week-item__company">Microsoft</div>
                    <div className="upcoming-week-item__role">UX Designer</div>
                    <div className="upcoming-week-item__date">21 Mar 2024, 02:00 PM</div>
                  </div>
                  <span className="upcoming-week-item__chevron">›</span>
                </div>

                <div className="upcoming-week-item">
                  <div className="upcoming-week-item__text">
                    <div className="upcoming-week-item__company">Adobe</div>
                    <div className="upcoming-week-item__role">Product Designer</div>
                    <div className="upcoming-week-item__date">25 Mar 2024, 11:30 AM</div>
                  </div>
                  <span className="upcoming-week-item__chevron">›</span>
                </div>
              </div>

              <div className="upcoming-week-footer">
                <a
                  href="#all-interviews"
                  className="upcoming-week-all-link"
                  onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <span>View all interviews</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Widget 3: Pro tip (Light Mint Green Card) */}
            <div className="interview-pro-tip-card" id="widget-pro-tip">
              <h4 className="interview-pro-tip__title">Pro tip</h4>
              <p className="interview-pro-tip__desc">
                Test your camera, mic, and internet connection before the interview. Be 5–10 minutes early!
              </p>
            </div>

            {/* Widget 4: Need help? */}
            <div className="interview-widget-card" id="widget-need-help">
              <h3 className="interview-widget__title interview-widget__title--standalone">
                Need help?
              </h3>
              <p className="interview-widget__subtitle">
                If you have any issues with your interview schedule, reach out to our support team.
              </p>
              <div className="interview-widget__help-footer">
                <a
                  href="#support"
                  className="interview-widget__contact-link"
                  onClick={(e) => {
                    e.preventDefault()
                    showToast('Connecting to JobRisers Support Team...')
                  }}
                >
                  <span>Contact Support</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal Dialog for Feedback / Details */}
      {activeModal && (
        <div className="interview-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="interview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="interview-modal__header">
              <h3 className="interview-modal__title">
                {activeModal.includes('feedback') || activeModal === 'amazon-interview' || activeModal === 'spotify-interview'
                  ? 'Interview Feedback'
                  : 'Interview Details'}
              </h3>
              <button
                type="button"
                className="interview-modal__close"
                onClick={() => setActiveModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="interview-modal__body">
              {activeModal === 'amazon-interview' && (
                <>
                  <p><strong>Amazon — UX Designer (Completed)</strong></p>
                  <p style={{ marginTop: '8px', color: '#475569' }}>
                    "Candidate demonstrated exceptional clarity on problem definition, design systems consistency, and cross-functional user research. Recommended for next steps."
                  </p>
                </>
              )}
              {activeModal === 'spotify-interview' && (
                <>
                  <p><strong>Spotify — Product Designer (Completed)</strong></p>
                  <p style={{ marginTop: '8px', color: '#475569' }}>
                    "Strong visual craft and storytelling skills. Impressive design sprint walkthrough with well-articulated metrics."
                  </p>
                </>
              )}
              {activeModal === 'atlassian-interview' && (
                <>
                  <p><strong>Atlassian — UI Designer (Not Selected)</strong></p>
                  <p style={{ marginTop: '8px', color: '#475569' }}>
                    "The role was filled by an internal team transfer. We encourage you to reapply for upcoming senior openings."
                  </p>
                </>
              )}
              {activeModal === 'microsoft-interview' && (
                <>
                  <p><strong>Microsoft India Development Center, Hyderabad</strong></p>
                  <p style={{ marginTop: '8px', color: '#475569' }}>
                    Building 3, Campus Gate 2, Hyderabad, Telangana. Please bring a valid government photo ID for visitor pass registration at the reception desk.
                  </p>
                </>
              )}
            </div>
            <div className="interview-modal__footer">
              <button
                type="button"
                className="interview-modal__btn"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="interview-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
