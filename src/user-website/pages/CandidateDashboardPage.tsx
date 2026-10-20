import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Search,
  Briefcase,
  Eye,
  ShieldCheck,
  Video,
  ExternalLink,
  Download,
  Kanban,
  List,
  Sparkles,
  Bookmark,
  FileText,
  Globe,
  MoreHorizontal,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react'
import '../styles/dashboard.css'

export default function CandidateDashboardPage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<{ [key: string]: boolean }>({})

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  const handle1ClickApply = (roleTitle: string, company: string) => {
    setAppliedJobs((prev) => ({ ...prev, [`${roleTitle}-${company}`]: true }))
    showToast(`Application successfully submitted for ${roleTitle} at ${company}!`)
  }

  return (
    <div className="dash-root" id="candidate-dashboard-root">
      {/* ------------------------------------------------------------------
          1. Top Navigation Bar (Matches Reference & Design System)
          ------------------------------------------------------------------ */}
      <header className="dash-nav" id="dash-header-nav">
        <div className="dash-nav__container">
          {/* Left: Brand Logo & Search */}
          <div className="dash-nav__left">
            <Link to="/dashboard" className="dash-nav__logo" id="dash-nav-logo">
              <span className="dash-nav__logo-badge">
                <span className="dash-nav__logo-badge-text">J</span>
                <span className="dash-nav__logo-badge-sub">JobRisers</span>
              </span>
              <span className="dash-nav__logo-text">
                <span className="dash-nav__logo-text--job">Job</span>
                <span className="dash-nav__logo-text--risers">Risers</span>
              </span>
            </Link>

            {/* Global Search */}
            <div className="dash-nav__search">
              <Search className="dash-nav__search-icon" size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                className="dash-nav__search-input"
                id="dash-search-input"
              />
            </div>
          </div>

          {/* Right: Navigation Links, Notification Bell, User Profile */}
          <div className="dash-nav__right">
            <nav className="dash-nav__links">
              <Link to="/jobs" className="dash-nav__link" id="nav-jobs">
                Jobs
              </Link>
              <Link to="/companies" className="dash-nav__link" id="nav-companies">
                Companies
              </Link>
              <Link to="/#career-advice" className="dash-nav__link" id="nav-career-advice">
                Career Advice
              </Link>
            </nav>

            <div className="dash-nav__user-wrap">
              {/* Notification Bell */}
              <div
                className="dash-nav__notif-wrap"
                title="Notifications"
                onClick={() => showToast('You have 2 upcoming interviews this week.')}
                id="dash-notif-btn"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="dash-nav__notif-dot" />
              </div>

              {/* Logged in User: AJ Alex Johnson */}
              <Link
                to="/settings"
                className="dash-nav__user"
                id="dash-user-profile"
                title="Account Settings"
              >
                <div className="dash-nav__avatar">AJ</div>
                <span className="dash-nav__username">Alex Johnson</span>
                <ChevronDown className="dash-nav__user-chevron" size={13} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          2. Main Dashboard Body Container
          ------------------------------------------------------------------ */}
      <main className="dash-body">
        {/* ================================================================
            Hero / Welcome Banner
            ================================================================ */}
        <section className="dash-hero" id="dash-hero-banner">
          <div className="dash-hero__left">
            <div className="dash-eyebrow-pill">
              <span className="dash-eyebrow-dot" />
              <span>Career Intelligence Cockpit</span>
            </div>
            <h1 className="dash-hero__title">
              Welcome back, <span className="dash-hero__title-name">Alex</span>
            </h1>
            <p className="dash-hero__subtitle">
              You have <strong>2 upcoming interviews</strong> scheduled this week and <strong>3 pending application reviews</strong> awaiting employer feedback.
            </p>
          </div>

          <div className="dash-hero__actions">
            <button
              type="button"
              className="dash-action-btn-secondary"
              id="btn-sync-calendar"
              onClick={() => showToast('Calendar synced with Google Calendar and Outlook.')}
            >
              <Calendar size={15} color="#475569" />
              <span>Sync Calendar</span>
            </button>
            <button
              type="button"
              className="dash-action-btn-primary"
              id="btn-find-roles"
              onClick={() => navigate('/jobs')}
            >
              <Search size={15} />
              <span>Find Roles</span>
            </button>
          </div>
        </section>

        {/* ================================================================
            Four KPI Metric Cards Row
            ================================================================ */}
        <section className="dash-kpis-grid" id="dash-kpi-cards">
          {/* KPI Card 1: Active Applications */}
          <div className="dash-kpi-card" id="kpi-active-applications">
            <div className="dash-kpi-card__top">
              <span className="dash-kpi-card__label">Active Applications</span>
              <div className="dash-kpi-card__icon-wrap dash-kpi-card__icon-wrap--blue">
                <Briefcase size={15} />
              </div>
            </div>
            <div className="dash-kpi-card__mid">
              <span className="dash-kpi-card__value">12</span>
              <span className="dash-kpi-badge dash-kpi-badge--green">+2 this week</span>
            </div>
            <div className="dash-kpi-card__bottom">
              with 10 top-tier companies
            </div>
          </div>

          {/* KPI Card 2: Interview Stage */}
          <div className="dash-kpi-card" id="kpi-interview-stage">
            <div className="dash-kpi-card__top">
              <span className="dash-kpi-card__label">Interview Stage</span>
              <div className="dash-kpi-card__icon-wrap dash-kpi-card__icon-wrap--indigo">
                <Video size={15} />
              </div>
            </div>
            <div className="dash-kpi-card__mid">
              <span className="dash-kpi-card__value">3</span>
              <span className="dash-kpi-badge dash-kpi-badge--blue">1 in Technical Screen</span>
            </div>
            <div className="dash-kpi-card__bottom">
              Next: Stripe Tech Screen, <span className="dash-kpi-card__bottom-highlight">Tomorrow 2:00 PM</span>
            </div>
          </div>

          {/* KPI Card 3: Profile Views by Recruiters */}
          <div className="dash-kpi-card" id="kpi-profile-views">
            <div className="dash-kpi-card__top">
              <span className="dash-kpi-card__label">Profile Views by Recruiters</span>
              <div className="dash-kpi-card__icon-wrap dash-kpi-card__icon-wrap--purple">
                <Eye size={15} />
              </div>
            </div>
            <div className="dash-kpi-card__mid">
              <span className="dash-kpi-card__value">148</span>
              <span className="dash-kpi-badge dash-kpi-badge--green">+18%</span>
            </div>
            <div className="dash-kpi-card__bottom">
              64 sourced directly from search
            </div>
          </div>

          {/* KPI Card 4: Profile Strength */}
          <div className="dash-kpi-card" id="kpi-profile-strength">
            <div className="dash-kpi-card__top">
              <span className="dash-kpi-card__label">Profile Strength</span>
              <div className="dash-kpi-card__icon-wrap dash-kpi-card__icon-wrap--teal">
                <ShieldCheck size={15} />
              </div>
            </div>
            <div className="dash-kpi-card__mid">
              <span className="dash-kpi-card__value">95%</span>
              <span className="dash-kpi-badge dash-kpi-badge--teal">All-Star</span>
            </div>
            <div className="dash-kpi-card__bottom">
              Top tier! Figma portfolio asserted
            </div>
          </div>
        </section>

        {/* ================================================================
            Main Workspace: Two Columns Layout (Kanban Board + Sidebar Widgets)
            ================================================================ */}
        <div className="dash-workspace">
          {/* --------------------------------------------------------------
              LEFT COLUMN: Applications Board / Tracker
              -------------------------------------------------------------- */}
          <section className="dash-apps-section" id="dash-applications-board">
            <div className="dash-apps-header">
              <div className="dash-apps-header__left">
                <h2 className="dash-apps-title">Applications</h2>
                <span className="dash-apps-count-pill">12 Active</span>
              </div>

              {/* Board / List Switch Toggle */}
              <div className="dash-view-toggle">
                <button
                  type="button"
                  className={`dash-view-btn ${viewMode === 'board' ? 'dash-view-btn--active' : ''}`}
                  onClick={() => setViewMode('board')}
                  id="view-toggle-board"
                >
                  <Kanban size={13} />
                  <span>Board</span>
                </button>
                <button
                  type="button"
                  className={`dash-view-btn ${viewMode === 'list' ? 'dash-view-btn--active' : ''}`}
                  onClick={() => setViewMode('list')}
                  id="view-toggle-list"
                >
                  <List size={13} />
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Three Kanban Columns */}
            <div className="dash-kanban-board">
              {/* ==========================================
                  Column 1: Applied (4)
                  ========================================== */}
              <div className="dash-kanban-col" id="col-applied">
                <div className="dash-kanban-col__header">
                  <div className="dash-kanban-col__title-wrap">
                    <span className="dash-col-dot dash-col-dot--blue" />
                    <span className="dash-kanban-col__title">Applied</span>
                    <span className="dash-kanban-col__count">4</span>
                  </div>
                  <button type="button" className="dash-col-more-btn" aria-label="More options">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <div className="dash-kanban-cards">
                  {/* Card 1: Figma */}
                  <div className="dash-app-card" id="card-figma">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--figma">F</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Staff UI Designer</h3>
                        <div className="dash-card-company">Figma</div>
                      </div>
                    </div>
                    <div className="dash-card-meta">
                      Submitted Feb 24 &bull; $140k - $165k
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-status-pill dash-card-status-pill--amber">In review</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => navigate('/jobs/product-designer')}
                      >
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Airbnb */}
                  <div className="dash-app-card" id="card-airbnb">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--airbnb">A</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Product Lead</h3>
                        <div className="dash-card-company">Airbnb</div>
                      </div>
                    </div>
                    <div className="dash-card-meta">
                      Submitted Feb 22 &bull; $165k - $195k
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-status-pill dash-card-status-pill--blue">Screening profile</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => navigate('/jobs/product-designer')}
                      >
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Stripe */}
                  <div className="dash-app-card" id="card-stripe">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--stripe">S</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Design Systems Lead</h3>
                        <div className="dash-card-company">Stripe</div>
                      </div>
                    </div>
                    <div className="dash-card-meta">
                      Submitted Feb 20 &bull; $150k - $180k
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-status-pill dash-card-status-pill--gray">Queued</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => navigate('/jobs/product-designer')}
                      >
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  Column 2: Screening (3)
                  ========================================== */}
              <div className="dash-kanban-col" id="col-screening">
                <div className="dash-kanban-col__header">
                  <div className="dash-kanban-col__title-wrap">
                    <span className="dash-col-dot dash-col-dot--amber" />
                    <span className="dash-kanban-col__title">Screening</span>
                    <span className="dash-kanban-col__count">3</span>
                  </div>
                  <button type="button" className="dash-col-more-btn" aria-label="More options">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <div className="dash-kanban-cards">
                  {/* Card 1: Notion */}
                  <div className="dash-app-card" id="card-notion">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--notion">N</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Senior Product Designer</h3>
                        <div className="dash-card-company">Notion</div>
                      </div>
                    </div>
                    <div className="dash-card-meta">
                      Updated Yesterday &bull; $155k - $180k
                    </div>
                    <div className="dash-card-highlight-box">
                      Includes case study feedback
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-step">Step 2 of 4</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => showToast('Feedback: Strong visual hierarchy and systems thinking.')}
                      >
                        View Notes
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Spotify */}
                  <div className="dash-app-card" id="card-spotify">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--spotify">S</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Design Technologist</h3>
                        <div className="dash-card-company">Spotify</div>
                      </div>
                    </div>
                    <div className="dash-card-meta">
                      Updated 2d ago &bull; $140k - $165k
                    </div>
                    <div className="dash-card-highlight-box">
                      Recruiter chat completed
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-step">Step 2 of 4</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => showToast('Notes: Recruiter noted positive alignment with design tech stack.')}
                      >
                        View Notes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  Column 3: Interviewing (1)
                  ========================================== */}
              <div className="dash-kanban-col" id="col-interviewing">
                <div className="dash-kanban-col__header">
                  <div className="dash-kanban-col__title-wrap">
                    <span className="dash-col-dot dash-col-dot--purple" />
                    <span className="dash-kanban-col__title">Interviewing</span>
                    <span className="dash-kanban-col__count">1</span>
                  </div>
                  <button type="button" className="dash-col-more-btn" aria-label="More options">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <div className="dash-kanban-cards">
                  {/* Card 1: Stripe */}
                  <div className="dash-app-card" id="card-stripe-interviewing">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--stripe">S</div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">Lead Product Desig...</h3>
                        <div className="dash-card-company">Stripe &bull; Architecture &amp; Sys...</div>
                      </div>
                    </div>
                    <div className="dash-card-highlight-box dash-card-highlight-box--blue">
                      Next: Interview with Marcus Vance (VP Design)
                    </div>
                    <div className="dash-card-meta">
                      Tomorrow 2:00 PM - 3:00 PM EST
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-step">Round 3 of 4</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => navigate('/interviews')}
                      >
                        Interview Prep
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Google */}
                  <div className="dash-app-card" id="card-google-interviewing">
                    <div className="dash-app-card__header">
                      <div className="dash-card-logo dash-card-logo--google">
                        <span style={{ color: '#4285F4', fontWeight: 800 }}>G</span>
                      </div>
                      <div className="dash-card-info">
                        <h3 className="dash-card-title">UX Director</h3>
                        <div className="dash-card-company">Google</div>
                      </div>
                    </div>
                    <div className="dash-card-highlight-box">
                      Portfolio Deep Dive
                    </div>
                    <div className="dash-card-meta">
                      Scheduled for next week
                    </div>
                    <div className="dash-card-footer">
                      <span className="dash-card-step">Round 2 of 4</span>
                      <span
                        className="dash-card-action-link"
                        onClick={() => navigate('/interviews')}
                      >
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --------------------------------------------------------------
              RIGHT COLUMN: Sidebar Widgets
              -------------------------------------------------------------- */}
          <aside className="dash-sidebar-widgets">
            {/* Widget 1: Upcoming Interviews */}
            <div className="dash-widget" id="widget-upcoming-interviews">
              <div className="dash-widget__header">
                <div className="dash-widget__title-wrap">
                  <Calendar size={16} color="#2563eb" />
                  <h3 className="dash-widget__title">Upcoming Interviews</h3>
                </div>
                <Link to="/interviews" className="dash-widget__link">
                  View full schedule
                </Link>
              </div>

              {/* Interview Item 1 */}
              <div className="dash-interview-item">
                <div className="dash-interview-time">Tomorrow 2:00 PM - 3:00 PM EST</div>
                <h4 className="dash-interview-title">Stripe &bull; Architecture &amp; Systems</h4>
                <div className="dash-interview-interviewer">Interviewer: Marcus Vance</div>
                <button
                  type="button"
                  className="dash-interview-btn-zoom"
                  onClick={() => showToast('Opening Zoom Meeting Room...')}
                  id="btn-join-zoom"
                >
                  Join Zoom Room
                </button>
              </div>

              {/* Interview Item 2 */}
              <div className="dash-interview-item">
                <div className="dash-interview-time" style={{ color: '#64748b' }}>
                  Friday Mar 8, 10:00 AM PST
                </div>
                <h4 className="dash-interview-title">Datadog &bull; UX Director Presentation</h4>
                <div className="dash-interview-interviewer">Panel: 4 Product &amp; Engineering Leaders</div>
                <button
                  type="button"
                  className="dash-interview-btn-test"
                  onClick={() => showToast('Testing mic, camera, and network connection... All systems operational!')}
                  id="btn-check-test-room"
                >
                  Check Test Room
                </button>
              </div>
            </div>

            {/* Widget 2: Top Recommendations */}
            <div className="dash-widget" id="widget-top-recommendations">
              <div className="dash-widget__header" style={{ marginBottom: '6px' }}>
                <div className="dash-widget__title-wrap">
                  <Sparkles size={16} color="#f59e0b" />
                  <h3 className="dash-widget__title">Top Recommendations</h3>
                </div>
              </div>
              <p className="dash-widget__desc">Calibrated from your Design Leadership profile</p>

              {/* Rec 1 */}
              <div className="dash-rec-item">
                <div className="dash-rec-header">
                  <span className="dash-rec-title">VP of Product Design</span>
                  <span className="dash-rec-match">98% Match</span>
                </div>
                <div className="dash-rec-company">OpenAI &bull; San Francisco (Hybrid)</div>
                <div className="dash-rec-salary">$210k - $240k + Equity</div>
                <button
                  type="button"
                  className={`dash-rec-apply-btn ${appliedJobs['VP of Product Design-OpenAI'] ? 'dash-rec-apply-btn--applied' : ''}`}
                  onClick={() => handle1ClickApply('VP of Product Design', 'OpenAI')}
                >
                  {appliedJobs['VP of Product Design-OpenAI'] ? '✓ Applied' : '1-Click Apply'}
                </button>
              </div>

              {/* Rec 2 */}
              <div className="dash-rec-item">
                <div className="dash-rec-header">
                  <span className="dash-rec-title">Principal Interaction Architect</span>
                  <span className="dash-rec-match">94% Match</span>
                </div>
                <div className="dash-rec-company">Anthropic &bull; San Francisco / Remote</div>
                <div className="dash-rec-salary">$195k - $215k</div>
                <button
                  type="button"
                  className={`dash-rec-apply-btn ${appliedJobs['Principal Interaction Architect-Anthropic'] ? 'dash-rec-apply-btn--applied' : ''}`}
                  onClick={() => handle1ClickApply('Principal Interaction Architect', 'Anthropic')}
                >
                  {appliedJobs['Principal Interaction Architect-Anthropic'] ? '✓ Applied' : '1-Click Apply'}
                </button>
              </div>
            </div>

            {/* Widget 3: Saved Roles */}
            <div className="dash-widget" id="widget-saved-roles">
              <div className="dash-widget__header">
                <div className="dash-widget__title-wrap">
                  <Bookmark size={16} color="#6366f1" />
                  <h3 className="dash-widget__title">Saved Roles (4)</h3>
                </div>
                <span
                  className="dash-widget__link"
                  onClick={() => navigate('/jobs')}
                >
                  View All
                </span>
              </div>

              <div className="dash-saved-item">
                <div>
                  <h4 className="dash-saved-title">Design Director</h4>
                  <p className="dash-saved-meta">Linear &bull; $170k - $195k</p>
                </div>
                <button
                  type="button"
                  className="dash-saved-btn"
                  onClick={() => handle1ClickApply('Design Director', 'Linear')}
                >
                  {appliedJobs['Design Director-Linear'] ? 'Applied' : 'Apply'}
                </button>
              </div>

              <div className="dash-saved-item">
                <div>
                  <h4 className="dash-saved-title">Staff Design Systems</h4>
                  <p className="dash-saved-meta">DoorDash &bull; $160k - $185k</p>
                </div>
                <button
                  type="button"
                  className="dash-saved-btn"
                  onClick={() => handle1ClickApply('Staff Design Systems', 'DoorDash')}
                >
                  {appliedJobs['Staff Design Systems-DoorDash'] ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Widget 4: Application Artifacts */}
            <div className="dash-widget" id="widget-application-artifacts">
              <div className="dash-widget__header">
                <div className="dash-widget__title-wrap">
                  <FileText size={16} color="#ec4899" />
                  <h3 className="dash-widget__title">Application Artifacts</h3>
                </div>
              </div>

              {/* Artifact 1: CV */}
              <div className="dash-artifact-item">
                <div className="dash-artifact-icon dash-artifact-icon--pdf">PDF</div>
                <div className="dash-artifact-info">
                  <h4 className="dash-artifact-title">Sarah_Jenkins_CV_2025.pdf</h4>
                  <p className="dash-artifact-meta">
                    Updated 2 days ago &bull; <CheckCircle2 size={11} color="#059669" /> <span className="dash-artifact-meta--green">Verified ATS 99%</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="dash-artifact-action-btn"
                  title="Download Resume"
                  onClick={() => showToast('Downloading Sarah_Jenkins_CV_2025.pdf...')}
                >
                  <Download size={15} />
                </button>
              </div>

              {/* Artifact 2: Portfolio */}
              <div className="dash-artifact-item">
                <div className="dash-artifact-icon dash-artifact-icon--globe">
                  <Globe size={16} />
                </div>
                <div className="dash-artifact-info">
                  <h4 className="dash-artifact-title">Interactive Portfolio</h4>
                  <p className="dash-artifact-meta">sarahjenkins.design</p>
                </div>
                <button
                  type="button"
                  className="dash-artifact-action-btn"
                  title="Visit Portfolio"
                  onClick={() => window.open('https://sarahjenkins.design', '_blank')}
                >
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="dash-toast" role="status" aria-live="polite">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
