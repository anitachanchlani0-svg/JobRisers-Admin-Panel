import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import '../styles/resumebuilder.css'

export default function ResumeBuilderPage() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('modern-split')
  const [accentColor, setAccentColor] = useState('blue')
  const [spacingDensity, setSpacingDensity] = useState('compact')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [proModalOpen, setProModalOpen] = useState(false)

  const handleExportPdf = () => {
    alert('Exporting free watermarked PDF. Upgrade to JobRisers Pro to unlock clean, unbranded vector exports.')
  }

  return (
    <div className="resumebuilder-page" id="screen-9-resume-builder">
      {/* ----------------------------------------------------
          1. Top Navigation Bar (Exact Screen 9 Match)
          ---------------------------------------------------- */}
      <header className="resumebuilder-nav">
        <div className="resumebuilder-nav__container">
          {/* Left: Logo & Navigation */}
          <div className="resumebuilder-nav__left">
            <Link to="/" className="resumebuilder-nav__logo" id="resumebuilder-logo">
              <img
                src="/jobrisers-logo.svg"
                alt="JobRisers"
                className="resumebuilder-nav__logo-img"
                width="28"
                height="28"
              />
              <span className="resumebuilder-nav__logo-text">
                <span className="resumebuilder-nav__logo-job">Job</span>
                <span className="resumebuilder-nav__logo-risers">Risers</span>
              </span>
            </Link>

            <nav className="resumebuilder-nav__links">
              <Link to="/jobs" className="resumebuilder-nav__link">
                Jobs
              </Link>
              <Link to="/companies" className="resumebuilder-nav__link">
                Companies
              </Link>
              <Link
                to="/resume-builder"
                className="resumebuilder-nav__link resumebuilder-nav__link--active"
                id="nav-resume-builder"
              >
                Resume Builder
              </Link>
              <Link to="/#career-advice" className="resumebuilder-nav__link">
                Career Advice
              </Link>
            </nav>
          </div>

          {/* Center: Global Search Input */}
          <div className="resumebuilder-nav__search">
            <span className="resumebuilder-nav__search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search jobs, companies & skills..."
              className="resumebuilder-nav__search-input"
              id="resume-search-input"
            />
          </div>

          {/* Right: Pro Badge, Notifications, User Profile */}
          <div className="resumebuilder-nav__right">
            <div className="resumebuilder-nav__pro-badge" id="nav-pro-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>PRO</span>
            </div>

            <button type="button" className="resumebuilder-nav__bell-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="resumebuilder-nav__bell-dot" />
            </button>

            <Link
              to="/settings"
              className="resumebuilder-nav__user"
              id="nav-user-profile"
              title="Click to view Account Settings"
            >
              <div className="resumebuilder-nav__avatar">AJ</div>
              <div className="resumebuilder-nav__user-info">
                <span className="resumebuilder-nav__user-name">Alex Johnson</span>
                <span className="resumebuilder-nav__user-role">Candidate</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------
          2. Document Subheader Toolbar (Exact Screen 9 Match)
          ---------------------------------------------------- */}
      <section className="resumebuilder-toolbar">
        <div className="resumebuilder-toolbar__container">
          {/* Document details & Status */}
          <div className="resumebuilder-toolbar__left">
            <div className="resumebuilder-toolbar__doc-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <div className="resumebuilder-toolbar__titles">
              <div className="resumebuilder-toolbar__title-row">
                <h1 className="resumebuilder-toolbar__title">Alex Johnson — UI/UX Designer</h1>
                <span className="resumebuilder-toolbar__edit-icon" title="Rename Resume">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </span>
              </div>
              <div className="resumebuilder-toolbar__meta">
                Template: Modern Split (v2.4) • Saved 2 mins ago
              </div>
              <div>
                <span className="resumebuilder-toolbar__status-pill">
                  <span className="resumebuilder-toolbar__status-dot" />
                  <span>Ready to review • Resume up to date</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Toolbar Actions */}
          <div className="resumebuilder-toolbar__right">
            {/* Zoom / Page controls */}
            <div className="resumebuilder-toolbar__zoom-box">
              <span>Page 1 / 1</span>
              <span>—</span>
              <button
                type="button"
                className="resumebuilder-toolbar__zoom-btn"
                onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
                title="Zoom Out"
              >
                -
              </button>
              <span>{zoomLevel}%</span>
              <button
                type="button"
                className="resumebuilder-toolbar__zoom-btn"
                onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
                title="Zoom In"
              >
                +
              </button>
              <button type="button" className="resumebuilder-toolbar__expand-btn" title="Expand View">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
            </div>

            {/* Edit Data Button */}
            <button
              type="button"
              className="resumebuilder-toolbar__btn-edit"
              onClick={() => navigate('/settings')}
              id="btn-edit-resume-data"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Edit Data</span>
            </button>

            {/* Export PDF Button */}
            <button
              type="button"
              className="resumebuilder-toolbar__btn-export"
              onClick={handleExportPdf}
              id="btn-export-pdf"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export PDF</span>
              <span className="resumebuilder-toolbar__export-tag">Free Watermarked</span>
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. Main 2-Column Workspace (Exact Screen 9 Layout)
          ---------------------------------------------------- */}
      <main className="resumebuilder-workspace">
        {/* ==================================================
            LEFT: Live Resume Document Paper Canvas
            ================================================== */}
        <article className="resumebuilder-paper" id="resume-canvas-paper">
          {/* Header */}
          <div className="resume-doc-header">
            <div className="resume-doc-header__left">
              <div className="resume-doc-header__avatar">AJ</div>
              <div className="resume-doc-header__info">
                <h2 className="resume-doc-header__name">Alex Johnson</h2>
                <div className="resume-doc-header__title">
                  Senior UI/UX Designer &amp; Design Systems Architect
                </div>
                <div className="resume-doc-header__tagline">
                  Designing frictionless human interfaces &amp; high-velocity SaaS ecosystems
                </div>
              </div>
            </div>

            <div className="resume-doc-header__right">
              <span className="resume-doc-header__remote-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Open to Global Remote</span>
              </span>
              <div className="resume-doc-header__portfolio">
                Portfolio: <span className="resume-doc-header__portfolio-link">alexjohnson.design</span>
              </div>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="resume-doc-contact">
            <div className="resume-doc-contact__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>alex.johnson@pulsemail.io</span>
            </div>
            <div className="resume-doc-contact__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+1 (415) 890-2419</span>
            </div>
            <div className="resume-doc-contact__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Bengaluru / SF</span>
            </div>
            <div className="resume-doc-contact__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>linkedin.com/in/alexjohnson</span>
            </div>
          </div>

          {/* Two-Column Split Body */}
          <div className="resume-doc-body">
            {/* Left Sub-column */}
            <div className="resume-doc-sidebar">
              {/* Profile Summary */}
              <div>
                <h3 className="resume-section-title">
                  <span className="resume-section-title__icon">&amp;</span>
                  <span>PROFILE SUMMARY</span>
                </h3>
                <p className="resume-profile-summary">
                  User-focused UI/UX Designer with 6+ years specializing in enterprise B2B workflows, component libraries, and end-to-end design research that drives quantifiable product adoption.
                </p>
              </div>

              {/* Core Proficiencies */}
              <div>
                <h3 className="resume-section-title">
                  <span className="resume-section-title__icon">⚙</span>
                  <span>CORE PROFICIENCIES</span>
                </h3>
                <div className="resume-skills-list">
                  <span className="resume-skill-pill">Figma Systems</span>
                  <span className="resume-skill-pill">Design Tokens</span>
                  <span className="resume-skill-pill">User Research</span>
                  <span className="resume-skill-pill">Rapid Prototyping</span>
                  <span className="resume-skill-pill">Wireframing</span>
                  <span className="resume-skill-pill">WCAG 2.1 AA</span>
                  <span className="resume-skill-pill">Tailwind CSS</span>
                  <span className="resume-skill-pill">Usability Testing</span>
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h3 className="resume-section-title">
                  <span className="resume-section-title__icon">🏅</span>
                  <span>CREDENTIALS</span>
                </h3>
                <div className="resume-credential-item">
                  <div className="resume-credential-item__name">Google UX Design Certificate</div>
                  <div className="resume-credential-item__meta">Coursera • 2022</div>
                </div>
                <div className="resume-credential-item">
                  <div className="resume-credential-item__name">NN/g UX Master Certified</div>
                  <div className="resume-credential-item__meta">Nielsen Norman Group • 2021</div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="resume-section-title">
                  <span className="resume-section-title__icon">🎓</span>
                  <span>EDUCATION</span>
                </h3>
                <div className="resume-edu-item">
                  <div className="resume-edu-item__degree">B.Des in Interaction Design</div>
                  <div className="resume-edu-item__school">National Institute of Design</div>
                  <div className="resume-edu-item__year">2015 — 2019 • Honors First Class</div>
                </div>
              </div>
            </div>

            {/* Right Sub-column */}
            <div className="resume-doc-main">
              {/* Work Experience */}
              <div>
                <h3 className="resume-section-heading">
                  <span className="resume-section-heading__dot">●</span>
                  <span>Work Experience</span>
                </h3>

                {/* Role 1 */}
                <div className="resume-exp-item">
                  <div className="resume-exp-item__top">
                    <span className="resume-exp-item__role">Lead Product Designer</span>
                    <span className="resume-exp-item__period">Jan 2022 — Present</span>
                  </div>
                  <div className="resume-exp-item__company">
                    TechCorp Cloud Platform • San Francisco / Hybrid
                  </div>
                  <ul className="resume-exp-item__bullets">
                    <li>
                      Architected enterprise design system used by 45+ cross-functional engineers, reducing frontend delivery sprint cycles by 34%.
                    </li>
                    <li>
                      Spearheaded redesign of candidate evaluation dashboard, elevating user session retention by 42% across 12,000 active recruiters.
                    </li>
                    <li>
                      Conducted 80+ customer discovery sessions and validated responsive interactive wireframes with 92% task-completion rate.
                    </li>
                  </ul>
                </div>

                {/* Role 2 */}
                <div className="resume-exp-item">
                  <div className="resume-exp-item__top">
                    <span className="resume-exp-item__role">UI/UX Designer</span>
                    <span className="resume-exp-item__period resume-exp-item__period--past">Jun 2019 — Dec 2021</span>
                  </div>
                  <div className="resume-exp-item__company">
                    DesignHub Studio • Bengaluru, India
                  </div>
                  <ul className="resume-exp-item__bullets">
                    <li>
                      Designed end-to-end user journeys for high-growth FinTech and healthcare SaaS clients from inception to final handoff.
                    </li>
                    <li>
                      Constructed interactive micro-interaction prototypes that secured $4.5M Series A funding for flagship portfolio startup.
                    </li>
                    <li>
                      Standardized accessibility audit guidelines across 14 web products, reaching strict WCAG 2.1 AA compliance benchmarks.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Featured Projects */}
              <div>
                <h3 className="resume-section-heading">
                  <span className="resume-section-heading__dot">●</span>
                  <span>Featured Projects</span>
                </h3>

                <div className="resume-projects-grid">
                  {/* Project 1 */}
                  <div className="resume-project-card">
                    <div>
                      <div className="resume-project-card__title-row">
                        <span>FinTrack Mobile Wealth</span>
                        <span className="resume-project-card__arrow">↗</span>
                      </div>
                      <p className="resume-project-card__desc">
                        Autonomous personal expense tracker with real-time portfolio forecasting. 120k+ downloads.
                      </p>
                    </div>
                    <a href="https://fintrack.app" target="_blank" rel="noreferrer" className="resume-project-card__link">
                      fintrack.app
                    </a>
                  </div>

                  {/* Project 2 */}
                  <div className="resume-project-card">
                    <div>
                      <div className="resume-project-card__title-row">
                        <span>Prism Design System</span>
                        <span className="resume-project-card__arrow">↗</span>
                      </div>
                      <p className="resume-project-card__desc">
                        Open-source component library and WCAG color contrast engine with 3.2k GitHub stars.
                      </p>
                    </div>
                    <a href="https://prism-ui.dev" target="_blank" rel="noreferrer" className="resume-project-card__link">
                      prism-ui.dev
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata & Watermark */}
          <div className="resume-doc-footer">
            <span>DOC-ID: JR-RES-09420-ALX</span>
            <span>VERIFIED ATS COMPLIANT • 98% MATCH SCORE</span>
            <div className="resume-doc-footer__watermark">
              <svg viewBox="0 0 24 24" fill="#2563eb" width="11" height="11">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span>Created with JobRisers</span>
            </div>
          </div>
        </article>

        {/* ==================================================
            RIGHT: Pro Funnel & Sidebar Controls
            ================================================== */}
        <aside className="resumebuilder-sidebar">
          {/* 1. JobRisers Pro Upgrade Card */}
          <div className="resumepro-card">
            <div className="resumepro-card__top">
              <span className="resumepro-card__badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>JOBRISERS PRO</span>
              </span>
              <div className="resumepro-card__price">
                $9.99 <span className="resumepro-card__price-sub">/month</span>
              </div>
            </div>

            <h3 className="resumepro-card__heading">
              Remove Watermark &amp; Unlock Clean Exports
            </h3>
            <p className="resumepro-card__desc">
              Present an elite, institutional impression to Fortune 500 recruiters with 100% unbranded, clean PDF and Word exports.
            </p>

            <ul className="resumepro-card__benefits">
              <li className="resumepro-card__benefit-item">
                <svg className="resumepro-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Watermark-free, razor-sharp 300 DPI vector PDF exports</span>
              </li>
              <li className="resumepro-card__benefit-item">
                <svg className="resumepro-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Access all 12+ executive &amp; ATS-validated templates</span>
              </li>
              <li className="resumepro-card__benefit-item">
                <svg className="resumepro-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>AI bullet metric rewriter &amp; job description tailoring</span>
              </li>
              <li className="resumepro-card__benefit-item">
                <svg className="resumepro-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>Unlimited resume variations &amp; priority recruiter indexing</span>
              </li>
            </ul>

            <button
              type="button"
              className="resumepro-card__cta-btn"
              onClick={() => setProModalOpen(true)}
              id="btn-subscribe-pro"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Subscribe &amp; Remove Watermark</span>
            </button>

            <div className="resumepro-card__footer-note">
              Instant activation • Cancel anytime in 1-click • 7-day money back guarantee
            </div>
          </div>

          {/* 2. Resume Templates Card */}
          <div className="resumetemplates-card">
            <div className="resumetemplates-card__header">
              <div className="resumetemplates-card__title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <span>Resume Templates</span>
              </div>
              <a href="#templates" className="resumetemplates-card__count">
                12 Available
              </a>
            </div>

            <div className="resumetemplates-grid">
              {/* Template 1: Modern Split (Active) */}
              <div
                className={`resumetemplate-item ${selectedTemplate === 'modern-split' ? 'resumetemplate-item--active' : ''}`}
                onClick={() => setSelectedTemplate('modern-split')}
              >
                <div className="resumetemplate-preview">
                  <div className="resumetemplate-wire-header" />
                  <div className="resumetemplate-wire-row">
                    <div className="resumetemplate-wire-col" style={{ flex: '0.4' }} />
                    <div className="resumetemplate-wire-col" style={{ flex: '0.6' }} />
                  </div>
                </div>
                <div className="resumetemplate-item__footer">
                  <span>Modern Split</span>
                  <span className="resumetemplate-check">✓</span>
                </div>
              </div>

              {/* Template 2: Executive */}
              <div
                className={`resumetemplate-item ${selectedTemplate === 'executive' ? 'resumetemplate-item--active' : ''}`}
                onClick={() => setSelectedTemplate('executive')}
              >
                <div className="resumetemplate-preview">
                  <div className="resumetemplate-wire-header" style={{ width: '70%', margin: '0 auto' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '90%', margin: '4px auto 0' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '85%', margin: '4px auto 0' }} />
                </div>
                <div className="resumetemplate-item__footer">
                  <span>Executive</span>
                  <span className="resumetemplate-badge resumetemplate-badge--atspro">ATS Pro</span>
                </div>
              </div>

              {/* Template 3: Minimalist */}
              <div
                className={`resumetemplate-item ${selectedTemplate === 'minimalist' ? 'resumetemplate-item--active' : ''}`}
                onClick={() => setSelectedTemplate('minimalist')}
              >
                <div className="resumetemplate-preview">
                  <div className="resumetemplate-wire-line" style={{ width: '50%' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '80%' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '75%' }} />
                </div>
                <div className="resumetemplate-item__footer">
                  <span>Minimalist</span>
                  <span className="resumetemplate-badge resumetemplate-badge--std">Standard</span>
                </div>
              </div>

              {/* Template 4: Tech Mono */}
              <div
                className={`resumetemplate-item ${selectedTemplate === 'tech-mono' ? 'resumetemplate-item--active' : ''}`}
                onClick={() => setSelectedTemplate('tech-mono')}
              >
                <div className="resumetemplate-preview resumetemplate-preview--dark">
                  <div className="resumetemplate-wire-line" style={{ width: '40%', background: '#38bdf8' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '80%', background: '#4ade80' }} />
                  <div className="resumetemplate-wire-line" style={{ width: '60%', background: '#94a3b8' }} />
                </div>
                <div className="resumetemplate-item__footer">
                  <span>Tech Mono</span>
                  <span className="resumetemplate-badge resumetemplate-badge--pro">PRO 🔒</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Customization Controls Card */}
          <div className="resumecustom-card">
            <div className="resumecustom-card__header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Customization Controls</span>
            </div>

            {/* Remove Watermark Toggle */}
            <div className="resumecustom-toggle-box">
              <div className="resumecustom-toggle-text">
                <div className="resumecustom-toggle-title">
                  <span>Remove Watermark</span>
                  <span className="resumecustom-toggle-pro">PRO</span>
                </div>
                <div className="resumecustom-toggle-desc">Exports unbranded document</div>
              </div>
              <div className="resumecustom-switch" title="Upgrade to Pro to remove watermark">
                <div className="resumecustom-switch__thumb" />
              </div>
            </div>

            {/* Accent Brand Color */}
            <div className="resumecustom-section">
              <label className="resumecustom-label">Accent Brand Color</label>
              <div className="resumecustom-colors">
                <button
                  type="button"
                  className={`resumecustom-color-btn ${accentColor === 'blue' ? 'resumecustom-color-btn--active' : ''}`}
                  style={{ background: '#2563eb' }}
                  onClick={() => setAccentColor('blue')}
                  title="Royal Blue"
                />
                <button
                  type="button"
                  className={`resumecustom-color-btn ${accentColor === 'cyan' ? 'resumecustom-color-btn--active' : ''}`}
                  style={{ background: '#06b6d4' }}
                  onClick={() => setAccentColor('cyan')}
                  title="Cyan"
                />
                <button
                  type="button"
                  className={`resumecustom-color-btn ${accentColor === 'crimson' ? 'resumecustom-color-btn--active' : ''}`}
                  style={{ background: '#e11d48' }}
                  onClick={() => setAccentColor('crimson')}
                  title="Crimson"
                />
                <button
                  type="button"
                  className={`resumecustom-color-btn ${accentColor === 'dark' ? 'resumecustom-color-btn--active' : ''}`}
                  style={{ background: '#0f172a' }}
                  onClick={() => setAccentColor('dark')}
                  title="Dark Charcoal"
                />
              </div>
            </div>

            {/* Typography Pairing */}
            <div className="resumecustom-section">
              <label className="resumecustom-label">Typography Pairing</label>
              <select className="resumecustom-select" defaultValue="default">
                <option value="default">Plus Jakarta Sans &amp; Inter (Default)</option>
                <option value="serif">Playfair Display &amp; Inter</option>
                <option value="mono">JetBrains Mono &amp; Plus Jakarta</option>
              </select>
            </div>

            {/* Content Spacing & Density */}
            <div className="resumecustom-section">
              <label className="resumecustom-label">Content Spacing &amp; Density</label>
              <div className="resumecustom-density">
                <button
                  type="button"
                  className={`resumecustom-density-btn ${spacingDensity === 'compact' ? 'resumecustom-density-btn--active' : ''}`}
                  onClick={() => setSpacingDensity('compact')}
                >
                  Compact
                </button>
                <button
                  type="button"
                  className={`resumecustom-density-btn ${spacingDensity === 'balanced' ? 'resumecustom-density-btn--active' : ''}`}
                  onClick={() => setSpacingDensity('balanced')}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  className={`resumecustom-density-btn ${spacingDensity === 'roomy' ? 'resumecustom-density-btn--active' : ''}`}
                  onClick={() => setSpacingDensity('roomy')}
                >
                  Roomy
                </button>
              </div>
            </div>
          </div>

          {/* 4. Enterprise ATS Trust Note */}
          <div className="resumetrust-note">
            <svg className="resumetrust-note__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>
              Enterprise Grade PDF/A formatting. Guaranteed parseable by Workday, Greenhouse, Lever, and Taleo ATS bots.
            </span>
          </div>
        </aside>
      </main>

      {/* ----------------------------------------------------
          4. Page Footer (Exact Screen 9 Match)
          ---------------------------------------------------- */}
      <Footer />

      {/* Pro Modal Notice */}
      {proModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setProModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Upgrade to JobRisers Pro
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
              $9.99/month grants you unlimited unwatermarked 300 DPI exports, access to 12+ ATS templates, and AI resume tailoring.
            </p>
            <button
              type="button"
              style={{
                width: '100%',
                height: '42px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
              onClick={() => {
                alert('Pro upgrade simulation: Pro access unlocked!')
                setProModalOpen(false)
              }}
            >
              Confirm $9.99 /month Plan
            </button>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => setProModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
