import { useState } from 'react'
import {
  Send,
  Bookmark,
  MapPin,
  Briefcase,
  Calendar,
  IndianRupee,
  Heart,
  Laptop,
  GraduationCap,
  Utensils,
  Plane,
  Users,
} from 'lucide-react'
import '../styles/job-details.css'

export default function JobDetailsPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Show a temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Toggle Save Job state (synchronized across breadcrumb and right card)
  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev
      showToast(next ? 'Job saved to your bookmarks.' : 'Job removed from bookmarks.')
      return next
    })
  }

  // Share action with Web Share API and Clipboard fallback
  const handleShare = async () => {
    const shareData = {
      title: 'Product Designer at Google — JobRisers',
      text: 'Explore this Product Designer role at Google on JobRisers!',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        showToast('Shared successfully!')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard()
        }
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast('Job link copied to clipboard!'))
      .catch(() => showToast('Could not copy link.'))
  }


  return (
    <div className="jd-page">
      {/* ------------------------------------------------------------------
          1. Top Navigation Bar
          ------------------------------------------------------------------ */}
      <header className="jd-nav">
        <div className="jd-nav__container">
          {/* Logo */}
          <a href="/" className="jd-nav__logo" id="jd-nav-logo">
            <img
              src="/jobrisers-logo.svg"
              alt="JobRisers"
              width="32"
              height="32"
              className="jd-nav__logo-img"
            />
            <span className="jd-nav__logo-text">
              <span className="jd-nav__logo-text--job">Job</span>
              <span className="jd-nav__logo-text--risers">Risers</span>
            </span>
          </a>

          {/* Center Links (Jobs has active purple underline) */}
          <nav className="jd-nav__links">
            <a href="/jobs" className="jd-nav__link jd-nav__link--active" id="nav-jobs">
              Jobs
            </a>
            <a href="/companies" className="jd-nav__link" id="nav-companies">
              Companies
            </a>
            <a href="/#career-advice" className="jd-nav__link" id="nav-career-advice">
              Career Advice
            </a>
            <a href="/#for-employers" className="jd-nav__link" id="nav-employers">
              For Employers
            </a>
          </nav>

          {/* Right Logged-in User */}
          <div className="jd-nav__user" id="jd-user-profile">
            <div className="jd-nav__avatar">AJ</div>
            <span className="jd-nav__username">Alex Johnson</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          2. Breadcrumb & Actions Bar
          ------------------------------------------------------------------ */}
      <div className="jd-breadcrumb-bar">
        <div className="jd-breadcrumb-bar__container">
          <nav className="jd-breadcrumb" aria-label="Breadcrumb">
            <a href="/#jobs" className="jd-breadcrumb__link">
              Back to search
            </a>
            <span className="jd-breadcrumb__separator">/</span>
            <a href="/jobs" className="jd-breadcrumb__link">
              Jobs
            </a>
            <span className="jd-breadcrumb__separator">/</span>
            <span className="jd-breadcrumb__current">Product Designer</span>
          </nav>

          <div className="jd-breadcrumb__actions">
            <button className="jd-action-btn" onClick={handleShare} id="btn-share">
              <Send size={13} />
              <span>Share</span>
            </button>
            <button
              className={`jd-action-btn ${isSaved ? 'jd-action-btn--saved' : ''}`}
              onClick={handleToggleSave}
              id="btn-save-breadcrumb"
            >
              <Bookmark size={13} fill={isSaved ? '#4f46e5' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. Main 2-Column Content Layout
          ------------------------------------------------------------------ */}
      <main className="jd-main">
        <div className="jd-container">
          {/* ==============================================================
              Left Column: Main Job Information & Description
              ============================================================== */}
          <div className="jd-left-col">
            {/* Job Summary Card */}
            <section className="jd-summary-card">
              <div className="jd-summary-card__top">
                <div className="jd-summary-card__brand">
                  <div className="jd-company-logo jd-company-logo--google">
                    <span>G</span>
                  </div>
                  <div className="jd-summary-card__header-text">
                    <h1 className="jd-summary-card__title">Product Designer</h1>
                    <span className="jd-summary-card__company">Google</span>
                  </div>
                </div>
                <span className="jd-summary-card__posted">Posted 2 days ago</span>
              </div>

              {/* Meta information row */}
              <div className="jd-summary-card__meta-row">
                <span className="jd-meta-tag">Bengaluru, India</span>
                <span className="jd-meta-tag">Hybrid</span>
                <span className="jd-meta-tag">3-5 years</span>
                <span className="jd-meta-pill jd-meta-pill--green">Full-time</span>
              </div>

              {/* Skill tags row */}
              <div className="jd-summary-card__skills-row">
                <span className="jd-skill-tag">Figma</span>
                <span className="jd-skill-tag">UI/UX</span>
                <span className="jd-skill-tag">User Research</span>
                <span className="jd-skill-tag">Prototyping</span>
                <span className="jd-skill-tag">Design Systems</span>
              </div>
            </section>

            {/* Detailed Description Sections */}
            <div className="jd-content-card">
              {/* About the Role */}
              <section className="jd-section">
                <h2 className="jd-section__title">About the Role</h2>
                <p className="jd-section__text">
                  At Google, we believe great design has the power to solve complex problems and create meaningful experiences for billions of users. We are looking for a Product Designer who is passionate about user-centered design, curious about emerging technologies, and excited to build products that make a real impact.
                </p>
              </section>

              {/* Key Responsibilities */}
              <section className="jd-section">
                <h2 className="jd-section__title">Key Responsibilities</h2>
                <ul className="jd-section__list">
                  <li>Design intuitive and engaging user experiences for Google's products.</li>
                  <li>Collaborate with product managers, engineers, and researchers to define and solve user problems.</li>
                  <li>Create wireframes, high-fidelity designs, and interactive prototypes.</li>
                  <li>Conduct user research and usability testing to validate design decisions.</li>
                  <li>Iterate on designs based on feedback and data insights.</li>
                  <li>Contribute to and evolve Google's design system.</li>
                </ul>
              </section>

              {/* Qualifications */}
              <section className="jd-section">
                <h2 className="jd-section__title">Qualifications</h2>
                <ul className="jd-section__list">
                  <li>3+ years of experience in product design, UI/UX, or a related field.</li>
                  <li>Strong portfolio showcasing end-to-end product design projects.</li>
                  <li>Proficiency in design tools such as Figma, Sketch, or Adobe XD.</li>
                  <li>Experience with user research, usability testing, and design thinking.</li>
                  <li>Excellent communication and collaboration skills.</li>
                  <li>A passion for creating user-centered, inclusive, and accessible designs.</li>
                </ul>
              </section>

              {/* Preferred Skills */}
              <section className="jd-section">
                <h2 className="jd-section__title">Preferred Skills</h2>
                <div className="jd-preferred-skills">
                  <span className="jd-skill-tag">Figma</span>
                  <span className="jd-skill-tag">UI/UX Design</span>
                  <span className="jd-skill-tag">User Research</span>
                  <span className="jd-skill-tag">Prototyping</span>
                  <span className="jd-skill-tag">Design Systems</span>
                  <span className="jd-skill-tag">Visual Design</span>
                  <span className="jd-skill-tag">Interaction Design</span>
                </div>
              </section>

              {/* Benefits (6 pastel tiles) */}
              <section className="jd-section">
                <h2 className="jd-section__title">Benefits</h2>
                <div className="jd-benefits-grid">
                  {/* Health Insurance */}
                  <div className="jd-benefit-tile jd-benefit-tile--red">
                    <div className="jd-benefit-tile__icon-wrap">
                      <Heart size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Health Insurance</span>
                  </div>

                  {/* Flexible Work Hours */}
                  <div className="jd-benefit-tile jd-benefit-tile--teal">
                    <div className="jd-benefit-tile__icon-wrap">
                      <Laptop size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Flexible Work Hours</span>
                  </div>

                  {/* Learning & Development */}
                  <div className="jd-benefit-tile jd-benefit-tile--blue">
                    <div className="jd-benefit-tile__icon-wrap">
                      <GraduationCap size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Learning &amp; Development</span>
                  </div>

                  {/* Free Meals & Snacks */}
                  <div className="jd-benefit-tile jd-benefit-tile--yellow">
                    <div className="jd-benefit-tile__icon-wrap">
                      <Utensils size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Free Meals &amp; Snacks</span>
                  </div>

                  {/* Paid Time Off */}
                  <div className="jd-benefit-tile jd-benefit-tile--sky">
                    <div className="jd-benefit-tile__icon-wrap">
                      <Plane size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Paid Time Off</span>
                  </div>

                  {/* Parental Leave */}
                  <div className="jd-benefit-tile jd-benefit-tile--purple">
                    <div className="jd-benefit-tile__icon-wrap">
                      <Users size={16} className="jd-benefit-tile__icon" />
                    </div>
                    <span className="jd-benefit-tile__label">Parental Leave</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Application Deadline Card */}
            <section className="jd-deadline-card">
              <div className="jd-deadline-card__left">
                <span className="jd-deadline-card__eyebrow">Application Deadline</span>
                <span className="jd-deadline-card__date">30 April 2025</span>
                <span className="jd-deadline-card__note">Applications will be reviewed on a rolling basis.</span>
              </div>
              <div className="jd-deadline-card__right">
                <span className="jd-deadline-card__slogan">
                  Build for a better<br />tomorrow.
                </span>
              </div>
            </section>
          </div>

          {/* ==============================================================
              Right Column: Sticky Job Action & Details Cards
              ============================================================== */}
          <aside className="jd-right-col">
            {/* Card 1: Apply & Job Specs */}
            <div className="jd-side-card">
              <a
                href="/signup"
                className="jd-apply-btn"
                id="btn-apply-now"
              >
                Apply Now
              </a>
              <button
                className={`jd-save-btn ${isSaved ? 'jd-save-btn--saved' : ''}`}
                id="btn-save-side"
                onClick={handleToggleSave}
              >
                {isSaved ? 'Saved Job' : 'Save Job'}
              </button>

              <div className="jd-side-divider" />

              <div className="jd-side-specs">
                {/* Salary */}
                <div className="jd-spec-item">
                  <div className="jd-spec-item__icon-box">
                    <IndianRupee size={14} />
                  </div>
                  <div className="jd-spec-item__content">
                    <span className="jd-spec-item__value">₹12 - ₹18 LPA</span>
                    <span className="jd-spec-item__label">Salary range</span>
                  </div>
                </div>

                {/* Job type */}
                <div className="jd-spec-item">
                  <div className="jd-spec-item__icon-box">
                    <Briefcase size={14} />
                  </div>
                  <div className="jd-spec-item__content">
                    <span className="jd-spec-item__value">Full-time</span>
                    <span className="jd-spec-item__label">Job type</span>
                  </div>
                </div>

                {/* Work mode */}
                <div className="jd-spec-item">
                  <div className="jd-spec-item__icon-box">
                    <Laptop size={14} />
                  </div>
                  <div className="jd-spec-item__content">
                    <span className="jd-spec-item__value">Hybrid</span>
                    <span className="jd-spec-item__label">Work mode</span>
                  </div>
                </div>

                {/* Location */}
                <div className="jd-spec-item">
                  <div className="jd-spec-item__icon-box">
                    <MapPin size={14} />
                  </div>
                  <div className="jd-spec-item__content">
                    <span className="jd-spec-item__value">Bengaluru, India</span>
                    <span className="jd-spec-item__label">Location</span>
                  </div>
                </div>

                {/* Application deadline */}
                <div className="jd-spec-item">
                  <div className="jd-spec-item__icon-box">
                    <Calendar size={14} />
                  </div>
                  <div className="jd-spec-item__content">
                    <span className="jd-spec-item__value">30 Apr 2025</span>
                    <span className="jd-spec-item__label">Application deadline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: About Google */}
            <div className="jd-side-card">
              <h3 className="jd-side-card__heading">About Google</h3>
              <div className="jd-about-company__header">
                <div className="jd-company-logo jd-company-logo--google jd-company-logo--sm">
                  <span>G</span>
                </div>
                <span className="jd-about-company__name">Google</span>
              </div>
              <p className="jd-about-company__desc">
                Organize the world's information and make it universally accessible and useful.
              </p>
              <div className="jd-about-company__meta-list">
                <div className="jd-company-meta-item">
                  <span>100,000+ employees</span>
                </div>
                <div className="jd-company-meta-item">
                  <span>Technology</span>
                </div>
                <div className="jd-company-meta-item">
                  <span>Mountain View, CA (Global)</span>
                </div>
                <div className="jd-company-meta-item">
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jd-company-meta-link"
                  >
                    www.google.com
                  </a>
                </div>
              </div>
              <button
                className="jd-view-profile-btn"
                id="btn-view-profile"
                onClick={() => showToast('Google company profile will be available in future releases.')}
              >
                View Company Profile
              </button>
            </div>

            {/* Card 3: Similar Jobs */}
            <div className="jd-side-card">
              <div className="jd-side-card__header-row">
                <h3 className="jd-side-card__heading">Similar Jobs</h3>
                <a href="/jobs" className="jd-view-all-link">
                  View all
                </a>
              </div>

              <div className="jd-similar-jobs-list">
                {/* 1. Microsoft */}
                <div className="jd-similar-job-item">
                  <div className="jd-similar-job__logo jd-similar-job__logo--microsoft">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <rect width="9" height="9" fill="#F25022" />
                      <rect x="11" width="9" height="9" fill="#7FBA00" />
                      <rect y="11" width="9" height="9" fill="#00A4EF" />
                      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                    </svg>
                  </div>
                  <div className="jd-similar-job__details">
                    <h4 className="jd-similar-job__title">UX Designer</h4>
                    <span className="jd-similar-job__company">Microsoft</span>
                    <span className="jd-similar-job__location">Hyderabad, India</span>
                  </div>
                  <span className="jd-similar-job__time">1 day ago</span>
                </div>

                {/* 2. Amazon */}
                <div className="jd-similar-job-item">
                  <div className="jd-similar-job__logo jd-similar-job__logo--amazon">
                    <span style={{ color: '#d97706', fontWeight: 800, fontSize: '15px' }}>a</span>
                  </div>
                  <div className="jd-similar-job__details">
                    <h4 className="jd-similar-job__title">Product Designer</h4>
                    <span className="jd-similar-job__company">Amazon</span>
                    <span className="jd-similar-job__location">Bengaluru, India</span>
                  </div>
                  <span className="jd-similar-job__time">3 days ago</span>
                </div>

                {/* 3. Adobe */}
                <div className="jd-similar-job-item">
                  <div className="jd-similar-job__logo jd-similar-job__logo--adobe">
                    <span>A</span>
                  </div>
                  <div className="jd-similar-job__details">
                    <h4 className="jd-similar-job__title">UI/UX Designer</h4>
                    <span className="jd-similar-job__company">Adobe</span>
                    <span className="jd-similar-job__location">Noida, India</span>
                  </div>
                  <span className="jd-similar-job__time">4 days ago</span>
                </div>

                {/* 4. Spotify */}
                <div className="jd-similar-job-item">
                  <div className="jd-similar-job__logo jd-similar-job__logo--spotify">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803d">
                      <circle cx="12" cy="12" r="10" fill="#15803d" />
                      <path d="M7 9.5c3.2-1 6.8-.7 10 .8M7.8 12.5c2.6-.8 5.6-.6 8.2.6M8.6 15.5c2-.5 4.3-.4 6.3.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="jd-similar-job__details">
                    <h4 className="jd-similar-job__title">Senior Product Designer</h4>
                    <span className="jd-similar-job__company">Spotify</span>
                    <span className="jd-similar-job__location">Bengaluru, India</span>
                  </div>
                  <span className="jd-similar-job__time">5 days ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ------------------------------------------------------------------
          4. Toast Notification
          ------------------------------------------------------------------ */}
      {toastMessage && (
        <div className="jd-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
