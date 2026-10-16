import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  History,
  Bell,
  Check,
} from 'lucide-react'
import '../styles/jobs.css'

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  workMode: 'Hybrid' | 'Remote' | 'On-site'
  experience: string
  salaryLPA: number
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  postedTime: string
  skills: string[]
  route: string
  logoType: 'google' | 'microsoft' | 'amazon' | 'adobe' | 'spotify'
  logoText?: string
}

const ALL_JOBS: JobListing[] = [
  {
    id: 'google-product-designer',
    title: 'Product Designer',
    company: 'Google',
    location: 'Bengaluru, India',
    workMode: 'Remote',
    experience: '3-5 years',
    salaryLPA: 16,
    jobType: 'Full-time',
    postedTime: '2 days ago',
    skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'],
    route: '/jobs/product-designer',
    logoType: 'google',
    logoText: 'G',
  },
  {
    id: 'microsoft-software-engineer',
    title: 'Software Engineer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    experience: '2-5 years',
    salaryLPA: 18,
    jobType: 'Full-time',
    postedTime: '1 day ago',
    skills: ['React', 'Node.js', 'TypeScript', 'System Design'],
    route: '/jobs/product-designer',
    logoType: 'microsoft',
  },
  {
    id: 'amazon-product-manager',
    title: 'Product Manager',
    company: 'Amazon',
    location: 'Bengaluru, India',
    workMode: 'On-site',
    experience: '5-8 years',
    salaryLPA: 24,
    jobType: 'Full-time',
    postedTime: '3 days ago',
    skills: ['Product Strategy', 'Analytics', 'Leadership', 'Roadmaps'],
    route: '/jobs/product-designer',
    logoType: 'amazon',
    logoText: 'a',
  },
  {
    id: 'adobe-ui-ux-designer',
    title: 'UI/UX Designer',
    company: 'Adobe',
    location: 'Noida, India',
    workMode: 'Hybrid',
    experience: '3-6 years',
    salaryLPA: 15,
    jobType: 'Full-time',
    postedTime: '4 days ago',
    skills: ['Figma', 'Design Systems', 'User Testing', 'Visual Design'],
    route: '/jobs/product-designer',
    logoType: 'adobe',
    logoText: 'A',
  },
  {
    id: 'spotify-data-analyst',
    title: 'Data Analyst',
    company: 'Spotify',
    location: 'Remote',
    workMode: 'Remote',
    experience: '2-4 years',
    salaryLPA: 14,
    jobType: 'Full-time',
    postedTime: '5 days ago',
    skills: ['SQL', 'Python', 'Data Visualization', 'A/B Testing'],
    route: '/jobs/product-designer',
    logoType: 'spotify',
  },
]

const INITIAL_RECENT_SEARCHES = [
  { id: '1', query: 'Product Designer', location: 'in Bengaluru, India' },
  { id: '2', query: 'Remote Jobs', location: 'Worldwide' },
  { id: '3', query: 'UI/UX Designer', location: 'in India' },
  { id: '4', query: 'Google Jobs', location: 'Worldwide' },
  { id: '5', query: 'Design', location: 'in Bengaluru, India' },
]

export default function JobsPage() {
  const navigate = useNavigate()

  // Search state
  const [searchTitle, setSearchTitle] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [appliedSearchTitle, setAppliedSearchTitle] = useState('')
  const [appliedSearchLocation, setAppliedSearchLocation] = useState('')

  // Filter state
  const [experienceLevels, setExperienceLevels] = useState<{ [key: string]: boolean }>({
    entry: true,
    mid: true,
    senior: true,
    executive: true,
  })

  const [salaryRange, setSalaryRange] = useState<string>('any')

  const [jobTypes, setJobTypes] = useState<{ [key: string]: boolean }>({
    'Full-time': true,
    'Part-time': true,
    Contract: true,
    Internship: false,
  })

  const [workModes, setWorkModes] = useState<{ [key: string]: boolean }>({
    'On-site': true,
    Remote: true,
    Hybrid: true,
  })

  // Collapsible sections
  const [industryOpen, setIndustryOpen] = useState(false)
  const [datePostedOpen, setDatePostedOpen] = useState(false)

  // Sort dropdown
  const [sortBy, setSortBy] = useState('Most Relevant')
  const [sortOpen, setSortOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Recent searches
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES)

  // Handle Search Trigger
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAppliedSearchTitle(searchTitle)
    setAppliedSearchLocation(searchLocation)
    setCurrentPage(1)
  }

  // Clear All Filters
  const handleClearFilters = () => {
    setSearchTitle('')
    setSearchLocation('')
    setAppliedSearchTitle('')
    setAppliedSearchLocation('')
    setExperienceLevels({
      entry: true,
      mid: true,
      senior: true,
      executive: true,
    })
    setSalaryRange('any')
    setJobTypes({
      'Full-time': true,
      'Part-time': true,
      Contract: true,
      Internship: false,
    })
    setWorkModes({
      'On-site': true,
      Remote: true,
      Hybrid: true,
    })
    setCurrentPage(1)
  }

  // Clear All Recent Searches
  const handleClearRecentSearches = () => {
    setRecentSearches([])
  }

  // Filter and Search Logic
  const filteredJobs = useMemo(() => {
    return ALL_JOBS.filter((job) => {
      // Title / skills / company matching
      if (appliedSearchTitle.trim()) {
        const query = appliedSearchTitle.toLowerCase()
        const matchesTitle = job.title.toLowerCase().includes(query)
        const matchesCompany = job.company.toLowerCase().includes(query)
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(query))
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false
      }

      // Location matching
      if (appliedSearchLocation.trim()) {
        const locQuery = appliedSearchLocation.toLowerCase()
        const matchesLoc = job.location.toLowerCase().includes(locQuery)
        if (!matchesLoc) return false
      }

      // Work Mode matching
      if (!workModes[job.workMode]) {
        return false
      }

      // Job Type matching
      if (!jobTypes[job.jobType]) {
        return false
      }

      return true
    })
  }, [appliedSearchTitle, appliedSearchLocation, workModes, jobTypes])

  return (
    <div className="jobs-page-root">
      {/* ------------------------------------------------------------------
          1. Top Navigation Bar (Reproducing Reference Screenshot 2)
          ------------------------------------------------------------------ */}
      <header className="jobs-nav" id="jobs-header-nav">
        <div className="jobs-nav__container">
          {/* Logo */}
          <Link to="/" className="jobs-nav__logo" id="jobs-nav-logo">
            <img
              src="/jobrisers-logo.svg"
              alt="JobRisers"
              width="30"
              height="30"
              className="jobs-nav__logo-img"
            />
            <span className="jobs-nav__logo-text">
              <span className="jobs-nav__logo-text--job">Job</span>
              <span className="jobs-nav__logo-text--risers">Risers</span>
            </span>
          </Link>

          {/* Links: Jobs has active purple underline bar */}
          <nav className="jobs-nav__links">
            <Link to="/jobs" className="jobs-nav__link jobs-nav__link--active" id="nav-jobs">
              Jobs
            </Link>
            <Link to="/companies" className="jobs-nav__link" id="nav-companies">
              Companies
            </Link>
            <Link to="/#career-advice" className="jobs-nav__link" id="nav-career-advice">
              Career Advice
            </Link>
            <Link to="/#for-employers" className="jobs-nav__link" id="nav-employers">
              For Employers
            </Link>
          </nav>

          {/* Logged in User: AJ and Alex Johnson */}
          <div className="jobs-nav__user" id="jobs-user-profile">
            <div className="jobs-nav__avatar" aria-hidden="true">
              AJ
            </div>
            <span className="jobs-nav__username">Alex Johnson</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          2. Large Illustrated Lavender Hero Banner
          ------------------------------------------------------------------ */}
      <section className="jobs-hero-banner" id="jobs-hero-banner">
        <div className="jobs-hero-banner__inner">
          {/* Left Text & Search Bar */}
          <div className="jobs-hero-banner__left">
            <h1 className="jobs-hero-banner__title">Find Your Next Opportunity</h1>
            <p className="jobs-hero-banner__subtitle">
              Explore 50,000+ jobs from top companies and take the next step in your career.
            </p>

            {/* Horizontal Search Bar inside Banner */}
            <form className="jobs-hero-search" onSubmit={handleSearchSubmit} id="jobs-search-form">
              <div className="jobs-hero-search__field">
                <Search className="jobs-hero-search__icon" size={17} />
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="jobs-hero-search__input"
                  id="search-title-input"
                />
              </div>

              <div className="jobs-hero-search__divider" />

              <div className="jobs-hero-search__field">
                <MapPin className="jobs-hero-search__icon" size={17} />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="jobs-hero-search__input"
                  id="search-location-input"
                />
              </div>

              <button
                type="submit"
                className="jobs-hero-search__btn"
                id="search-jobs-btn"
              >
                Search Jobs
              </button>
            </form>
          </div>

          {/* Right Career-Themed Vector Artwork */}
          <div className="jobs-hero-banner__artwork" aria-hidden="true">
            <svg
              viewBox="0 0 540 210"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="jobs-hero-svg"
            >
              <defs>
                <linearGradient id="purpleBadge" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
                <filter id="cardShadow" x="-10" y="-5" width="160" height="90" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3730a3" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* Looped Flight Trail */}
              <path
                d="M40 95 C 90 40, 140 120, 190 70 C 230 30, 270 50, 310 38"
                stroke="#c7d2fe"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Small flying paper plane */}
              <g transform="translate(308, 32) rotate(-15)">
                <polygon points="0,0 16,6 4,14 6,7" fill="#818cf8" />
                <polygon points="0,0 16,6 8,6" fill="#a5b4fc" />
              </g>

              {/* Floating job alert / interview notification card */}
              <g transform="translate(145, 48)" filter="url(#cardShadow)">
                <rect width="115" height="58" rx="8" fill="#ffffff" stroke="#e0e7ff" strokeWidth="1" />
                <rect x="10" y="10" width="18" height="18" rx="4" fill="#6366f1" />
                {/* Briefcase inside card icon */}
                <path d="M14 15h10M17 13v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                <rect x="34" y="11" width="46" height="6" rx="3" fill="#cbd5e1" />
                <rect x="34" y="21" width="65" height="4" rx="2" fill="#e2e8f0" />
                <rect x="10" y="36" width="70" height="12" rx="4" fill="#f5f3ff" />
                <circle cx="16" cy="42" r="3" fill="#ec4899" />
                <rect x="24" y="40" width="45" height="4" rx="2" fill="#c4b5fd" />
              </g>

              {/* Floating Purple Circle Badge on Far Right */}
              <g transform="translate(485, 38)">
                <circle cx="18" cy="18" r="18" fill="url(#purpleBadge)" />
                <rect x="10" y="13" width="16" height="11" rx="2" stroke="#ffffff" strokeWidth="1.8" fill="none" />
                <path d="M14 13V11a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </g>

              {/* Floating Location Pin */}
              <g transform="translate(488, 125)">
                <circle cx="12" cy="12" r="10" fill="#ede9fe" />
                <path d="M12 7c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 6 3.5 6s3.5-3.5 3.5-6c0-2-1.5-3.5-3.5-3.5z" fill="#6366f1" />
                <circle cx="12" cy="10.5" r="1.2" fill="#ffffff" />
              </g>

              {/* Desk Surface */}
              <rect x="260" y="162" width="260" height="48" rx="6" fill="#ded7fc" />
              <line x1="260" y1="162" x2="520" y2="162" stroke="#c4b5fd" strokeWidth="2" />

              {/* Sleeping Cats on Desk */}
              <g transform="translate(425, 160)">
                {/* White/cream cat */}
                <ellipse cx="26" cy="14" rx="16" ry="10" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="1" />
                <circle cx="15" cy="11" r="7" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="1" />
                <polygon points="12,5 15,1 17,6" fill="#f472b6" />
                <polygon points="18,5 21,2 22,6" fill="#f472b6" />
                <path d="M12 12c1 1 3 1 4 0" stroke="#a855f7" strokeWidth="1" strokeLinecap="round" />
                {/* Brown sleeping cat beside it */}
                <ellipse cx="56" cy="15" rx="15" ry="9" fill="#fed7aa" stroke="#fdba74" strokeWidth="1" />
                <circle cx="46" cy="12" r="6" fill="#fed7aa" stroke="#fdba74" strokeWidth="1" />
                <polygon points="44,7 46,3 48,7" fill="#fb923c" />
                <path d="M43 13c1 1 2 1 3 0" stroke="#9a3412" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Woman Character Sitting at Desk (Hair in back -> Torso -> Head & Face -> Hair Bangs in front) */}
              <g transform="translate(350, 48)">
                {/* 1. Back Long Hair */}
                <path
                  d="M40 32 C 34 16, 52 4, 76 6 C 92 8, 98 20, 96 36 C 100 58, 96 82, 88 92 C 84 88, 84 70, 86 58 C 82 42, 50 42, 44 58 C 42 70, 40 88, 36 92 C 32 80, 34 48, 40 32 Z"
                  fill="#1e1035"
                />

                {/* 2. Torso & Purple Sweater */}
                <path
                  d="M28 85 C 28 65, 45 52, 65 52 C 85 52, 102 65, 102 85 L 108 120 L 22 120 Z"
                  fill="#5b21b6"
                />
                {/* White Collar */}
                <polygon points="65,58 55,52 75,52" fill="#ffffff" />

                {/* 3. Neck */}
                <rect x="58" y="42" width="14" height="15" fill="#ffd7ba" rx="4" />

                {/* 4. Head / Face */}
                <ellipse cx="65" cy="35" rx="17" ry="19" fill="#ffd7ba" />

                {/* 5. Facial Features */}
                {/* Eyes - looking up/left */}
                <ellipse cx="58" cy="34" rx="2" ry="2.5" fill="#1e1b4b" />
                <ellipse cx="72" cy="34" rx="2" ry="2.5" fill="#1e1b4b" />
                <circle cx="57" cy="33" r="0.8" fill="#ffffff" />
                <circle cx="71" cy="33" r="0.8" fill="#ffffff" />
                {/* Eyebrows */}
                <path d="M55 28 C 57 26, 61 27, 63 29" stroke="#1e1b4b" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M67 29 C 69 27, 73 26, 75 28" stroke="#1e1b4b" strokeWidth="1.2" strokeLinecap="round" />
                {/* Cheerful Smile */}
                <path d="M60 42 C 63 46, 67 46, 70 42" stroke="#e11d48" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                {/* Rosy Cheeks */}
                <ellipse cx="53" cy="38" rx="3.5" ry="1.8" fill="#f43f5e" opacity="0.35" />
                <ellipse cx="77" cy="38" rx="3.5" ry="1.8" fill="#f43f5e" opacity="0.35" />

                {/* 6. Front Bangs over Forehead */}
                <path
                  d="M48 24 C 54 13, 76 15, 82 25 C 75 21, 62 20, 52 25 Z"
                  fill="#2e1065"
                />
                <path
                  d="M46 25 C 44 32, 44 42, 47 48 C 45 42, 46 32, 48 26 Z"
                  fill="#2e1065"
                />

                {/* 7. Laptop on Desk */}
                <g transform="translate(10, 105)">
                  {/* Laptop Screen */}
                  <rect x="25" y="0" width="55" height="34" rx="4" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.5" />
                  <rect x="28" y="3" width="49" height="28" rx="2" fill="#c4b5fd" />
                  {/* Laptop Base */}
                  <polygon points="18,34 87,34 82,39 23,39" fill="#a78bfa" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Main Three-Column Layout Container
          ------------------------------------------------------------------ */}
      <main className="jobs-body">
        <div className="jobs-body__container">
          {/* ================================================================
              LEFT COLUMN — FILTERS
              ================================================================ */}
          <aside className="jobs-filter-col" aria-label="Filters">
            <div className="jobs-filter-card">
              {/* Filter Top Header */}
              <div className="jobs-filter-card__header">
                <h2 className="jobs-filter-card__title">Filters</h2>
                <button
                  type="button"
                  className="jobs-filter-card__clear-btn"
                  onClick={handleClearFilters}
                  id="clear-all-filters"
                >
                  Clear all
                </button>
              </div>

              {/* 1. Experience Level */}
              <div className="jobs-filter-group">
                <h3 className="jobs-filter-group__title">Experience Level</h3>
                <div className="jobs-filter-group__list">
                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={experienceLevels.entry}
                        onChange={(e) =>
                          setExperienceLevels((prev) => ({ ...prev, entry: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {experienceLevels.entry && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Entry Level (0-2 years)</span>
                    <span className="jobs-filter-item__count">(4,120)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={experienceLevels.mid}
                        onChange={(e) =>
                          setExperienceLevels((prev) => ({ ...prev, mid: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {experienceLevels.mid && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Mid Level (2-5 years)</span>
                    <span className="jobs-filter-item__count">(8,320)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={experienceLevels.senior}
                        onChange={(e) =>
                          setExperienceLevels((prev) => ({ ...prev, senior: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {experienceLevels.senior && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Senior Level (5-10 years)</span>
                    <span className="jobs-filter-item__count">(5,210)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={experienceLevels.executive}
                        onChange={(e) =>
                          setExperienceLevels((prev) => ({ ...prev, executive: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {experienceLevels.executive && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Executive (10+ years)</span>
                    <span className="jobs-filter-item__count">(1,120)</span>
                  </label>
                </div>
              </div>

              <div className="jobs-filter-divider" />

              {/* 2. Salary Range */}
              <div className="jobs-filter-group">
                <h3 className="jobs-filter-group__title">Salary Range</h3>
                <div className="jobs-filter-group__list">
                  <label className="jobs-filter-item">
                    <span className="jobs-radio-wrap">
                      <input
                        type="radio"
                        name="salary"
                        checked={salaryRange === 'any'}
                        onChange={() => setSalaryRange('any')}
                      />
                      <span className="jobs-radio-custom" />
                    </span>
                    <span className="jobs-filter-item__label">Any</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-radio-wrap">
                      <input
                        type="radio"
                        name="salary"
                        checked={salaryRange === '0-3'}
                        onChange={() => setSalaryRange('0-3')}
                      />
                      <span className="jobs-radio-custom" />
                    </span>
                    <span className="jobs-filter-item__label">₹0 - ₹3 LPA</span>
                    <span className="jobs-filter-item__count">(2,310)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-radio-wrap">
                      <input
                        type="radio"
                        name="salary"
                        checked={salaryRange === '5-10'}
                        onChange={() => setSalaryRange('5-10')}
                      />
                      <span className="jobs-radio-custom" />
                    </span>
                    <span className="jobs-filter-item__label">₹5 - ₹10 LPA</span>
                    <span className="jobs-filter-item__count">(6,420)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-radio-wrap">
                      <input
                        type="radio"
                        name="salary"
                        checked={salaryRange === '10-20'}
                        onChange={() => setSalaryRange('10-20')}
                      />
                      <span className="jobs-radio-custom" />
                    </span>
                    <span className="jobs-filter-item__label">₹10 - ₹20 LPA</span>
                    <span className="jobs-filter-item__count">(5,340)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-radio-wrap">
                      <input
                        type="radio"
                        name="salary"
                        checked={salaryRange === '20+'}
                        onChange={() => setSalaryRange('20+')}
                      />
                      <span className="jobs-radio-custom" />
                    </span>
                    <span className="jobs-filter-item__label">₹20+ LPA</span>
                    <span className="jobs-filter-item__count">(1,980)</span>
                  </label>
                </div>
              </div>

              <div className="jobs-filter-divider" />

              {/* 3. Job Type */}
              <div className="jobs-filter-group">
                <h3 className="jobs-filter-group__title">Job Type</h3>
                <div className="jobs-filter-group__list">
                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={jobTypes['Full-time']}
                        onChange={(e) =>
                          setJobTypes((prev) => ({ ...prev, 'Full-time': e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {jobTypes['Full-time'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Full-time</span>
                    <span className="jobs-filter-item__count">(12,440)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={jobTypes['Part-time']}
                        onChange={(e) =>
                          setJobTypes((prev) => ({ ...prev, 'Part-time': e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {jobTypes['Part-time'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Part-time</span>
                    <span className="jobs-filter-item__count">(2,230)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={jobTypes['Contract']}
                        onChange={(e) =>
                          setJobTypes((prev) => ({ ...prev, Contract: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {jobTypes['Contract'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Contract</span>
                    <span className="jobs-filter-item__count">(1,540)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={jobTypes['Internship']}
                        onChange={(e) =>
                          setJobTypes((prev) => ({ ...prev, Internship: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {jobTypes['Internship'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Internship</span>
                    <span className="jobs-filter-item__count">(1,120)</span>
                  </label>
                </div>
              </div>

              <div className="jobs-filter-divider" />

              {/* 4. Work Mode */}
              <div className="jobs-filter-group">
                <h3 className="jobs-filter-group__title">Work Mode</h3>
                <div className="jobs-filter-group__list">
                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={workModes['On-site']}
                        onChange={(e) =>
                          setWorkModes((prev) => ({ ...prev, 'On-site': e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {workModes['On-site'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">On-site</span>
                    <span className="jobs-filter-item__count">(8,210)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={workModes['Remote']}
                        onChange={(e) =>
                          setWorkModes((prev) => ({ ...prev, Remote: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {workModes['Remote'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Remote</span>
                    <span className="jobs-filter-item__count">(4,310)</span>
                  </label>

                  <label className="jobs-filter-item">
                    <span className="jobs-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={workModes['Hybrid']}
                        onChange={(e) =>
                          setWorkModes((prev) => ({ ...prev, Hybrid: e.target.checked }))
                        }
                      />
                      <span className="jobs-checkbox-custom">
                        {workModes['Hybrid'] && <Check size={12} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className="jobs-filter-item__label">Hybrid</span>
                    <span className="jobs-filter-item__count">(3,070)</span>
                  </label>
                </div>
              </div>

              <div className="jobs-filter-divider" />

              {/* 5. Collapsible Industry */}
              <div className="jobs-filter-collapsible">
                <button
                  type="button"
                  className="jobs-filter-collapsible__trigger"
                  onClick={() => setIndustryOpen(!industryOpen)}
                  aria-expanded={industryOpen}
                >
                  <span>Industry</span>
                  <span className="jobs-filter-collapsible__arrow">▲</span>
                </button>
                {industryOpen && (
                  <div className="jobs-filter-collapsible__content">
                    <p className="jobs-filter-collapsible__placeholder">Software, Design, Finance...</p>
                  </div>
                )}
              </div>

              <div className="jobs-filter-divider" />

              {/* 6. Collapsible Date Posted */}
              <div className="jobs-filter-collapsible">
                <button
                  type="button"
                  className="jobs-filter-collapsible__trigger"
                  onClick={() => setDatePostedOpen(!datePostedOpen)}
                  aria-expanded={datePostedOpen}
                >
                  <span>Date Posted</span>
                  <span className="jobs-filter-collapsible__arrow">▲</span>
                </button>
                {datePostedOpen && (
                  <div className="jobs-filter-collapsible__content">
                    <p className="jobs-filter-collapsible__placeholder">Last 24 hours, past week...</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ================================================================
              MIDDLE COLUMN — JOB RESULTS & PAGINATION
              ================================================================ */}
          <section className="jobs-results-col" aria-label="Job Results">
            {/* Header row: Count & Sort */}
            <div className="jobs-results-header">
              <span className="jobs-results-count" id="jobs-results-count">
                {appliedSearchTitle || appliedSearchLocation
                  ? `${filteredJobs.length} jobs found`
                  : '12,490 jobs found'}
              </span>

              <div className="jobs-sort-wrap">
                <span className="jobs-sort-label">Sort by:</span>
                <div className="jobs-sort-dropdown">
                  <button
                    type="button"
                    className="jobs-sort-btn"
                    onClick={() => setSortOpen(!sortOpen)}
                    id="jobs-sort-btn"
                  >
                    <span>{sortBy}</span>
                    <span className="jobs-sort-arrow">▲</span>
                  </button>
                  {sortOpen && (
                    <div className="jobs-sort-menu">
                      {['Most Relevant', 'Newest', 'Highest Salary'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`jobs-sort-menu-item ${sortBy === option ? 'jobs-sort-menu-item--active' : ''}`}
                          onClick={() => {
                            setSortBy(option)
                            setSortOpen(false)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* List of Compact Job Cards */}
            <div className="jobs-cards-list">
              {filteredJobs.length === 0 ? (
                <div className="jobs-empty-state">
                  <p className="jobs-empty-title">No jobs found matching your criteria</p>
                  <button type="button" className="jobs-empty-btn" onClick={handleClearFilters}>
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="jobs-card"
                    id={`job-card-${job.id}`}
                    onClick={() => navigate(job.route)}
                  >
                    {/* Top Row: Company Logo + Title/Company + Posted Time */}
                    <div className="jobs-card__top">
                      <div className="jobs-card__left">
                        {/* Logo */}
                        <div className={`jobs-card__logo jobs-card__logo--${job.logoType}`}>
                          {job.logoType === 'microsoft' ? (
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                              <rect width="9" height="9" fill="#F25022" />
                              <rect x="11" width="9" height="9" fill="#7FBA00" />
                              <rect y="11" width="9" height="9" fill="#00A4EF" />
                              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                            </svg>
                          ) : job.logoType === 'spotify' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#15803d">
                              <circle cx="12" cy="12" r="10" fill="#15803d" />
                              <path
                                d="M7 9.5c3.2-1 6.8-.7 10 .8M7.8 12.5c2.6-.8 5.6-.6 8.2.6M8.6 15.5c2-.5 4.3-.4 6.3.5"
                                stroke="#ffffff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          ) : (
                            <span className="jobs-card__logo-text">{job.logoText}</span>
                          )}
                        </div>

                        {/* Title and Company */}
                        <div className="jobs-card__headings">
                          <h3 className="jobs-card__title">{job.title}</h3>
                          <span className="jobs-card__company">{job.company}</span>
                        </div>
                      </div>

                      {/* Posted Time */}
                      <span className="jobs-card__posted">{job.postedTime}</span>
                    </div>

                    {/* Middle Specs Row (Location, WorkMode, Experience) */}
                    <div className="jobs-card__specs">
                      {job.location !== 'Remote' && (
                        <span className="jobs-card__spec">{job.location}</span>
                      )}
                      <span className="jobs-card__spec">{job.workMode}</span>
                      <span className="jobs-card__spec">{job.experience}</span>
                    </div>

                    {/* Bottom Row: Skill Tags + Apply Now Button */}
                    <div className="jobs-card__bottom">
                      <div className="jobs-card__tags">
                        {job.skills.map((skill) => (
                          <span key={skill} className="jobs-card__tag">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="jobs-card__apply-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(job.route)
                        }}
                        id={`apply-btn-${job.id}`}
                      >
                        Apply Now
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Bottom Pagination matching Reference Screenshot 2 */}
            <div className="jobs-pagination" id="jobs-pagination">
              <button
                type="button"
                className="jobs-pagination__arrow"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                aria-label="Previous Page"
              >
                ◀
              </button>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 1 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 2 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 3 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 4 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(4)}
              >
                4
              </button>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 5 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(5)}
              >
                5
              </button>

              <span className="jobs-pagination__ellipsis">...</span>

              <button
                type="button"
                className={`jobs-pagination__page ${currentPage === 500 ? 'jobs-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(500)}
              >
                500
              </button>

              <button
                type="button"
                className="jobs-pagination__arrow"
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Next Page"
              >
                ▶
              </button>
            </div>
          </section>

          {/* ================================================================
              RIGHT COLUMN — SIDEBAR WIDGETS
              ================================================================ */}
          <aside className="jobs-sidebar-col" aria-label="Sidebar Widgets">
            {/* Widget 1: Job Alert Card */}
            <div className="jobs-alert-card" id="job-alerts-widget">
              <h3 className="jobs-alert-card__title">Get job alerts that match your skills</h3>
              <p className="jobs-alert-card__subtitle">
                Be the first to know about new opportunities.
              </p>

              <button type="button" className="jobs-alert-card__btn" id="create-job-alert-btn">
                <Bell size={15} />
                <span>Create Job Alert</span>
              </button>

              {/* Graphic Illustration */}
              <div className="jobs-alert-card__graphic" aria-hidden="true">
                <svg
                  viewBox="0 0 240 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="jobs-alert-svg"
                >
                  {/* Decorative background clouds / sparkles */}
                  <path d="M15 45 C 30 35, 50 35, 65 45" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <path d="M195 20 L 198 25 L 204 26 L 199 30 L 201 36 L 195 32 L 190 36 L 192 30 L 187 26 L 193 25 Z" fill="#fde047" />
                  <path d="M40 22 L 42 25 L 46 26 L 43 28 L 44 32 L 40 30 L 37 32 L 38 28 L 35 26 L 39 25 Z" fill="#c4b5fd" />

                  {/* Floating Notification Envelope / Card */}
                  <g transform="translate(25, 26)">
                    <rect width="84" height="52" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
                    <rect x="8" y="8" width="16" height="16" rx="4" fill="#ede9fe" />
                    {/* Bell icon */}
                    <path d="M16 12a3 3 0 0 0-3 3v2l-1 1h8l-1-1v-2a3 3 0 0 0-3-3z" fill="#6366f1" />
                    <rect x="30" y="10" width="36" height="5" rx="2" fill="#4338ca" />
                    <rect x="30" y="18" width="44" height="3" rx="1.5" fill="#94a3b8" />
                    <line x1="8" y1="32" x2="76" y2="32" stroke="#f1f5f9" />
                    <rect x="8" y="38" width="50" height="4" rx="2" fill="#e2e8f0" />
                  </g>

                  {/* Girl Character with Phone */}
                  <g transform="translate(138, 12)">
                    {/* 1. Hair Back */}
                    <path d="M34 26 C 28 14, 42 4, 58 6 C 68 8, 72 18, 70 28 C 74 44, 70 62, 64 68 C 62 65, 60 50, 62 42 C 60 32, 38 32, 36 42 C 34 48, 33 62, 30 68 C 26 58, 28 36, 34 26 Z" fill="#1e1035" />
                    {/* 2. Torso */}
                    <path d="M22 68 C 22 52, 34 44, 48 44 C 62 44, 74 52, 74 68 L 78 88 L 18 88 Z" fill="#4f46e5" />
                    {/* 3. Neck */}
                    <rect x="43" y="36" width="10" height="10" fill="#ffd7ba" rx="2" />
                    {/* 4. Head & Face */}
                    <ellipse cx="48" cy="28" rx="12" ry="13" fill="#ffd7ba" />
                    {/* 5. Bangs */}
                    <path d="M38 20 C 44 12, 58 14, 62 20 Z" fill="#2e1065" />
                    {/* 6. Eyes & Smile */}
                    <circle cx="44" cy="26" r="1.3" fill="#1e1b4b" />
                    <circle cx="53" cy="26" r="1.3" fill="#1e1b4b" />
                    <path d="M46 32 C 48 35, 51 35, 53 32" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" fill="none" />
                    {/* 7. Arm holding phone */}
                    <path d="M30 60 L 40 50 L 42 54" stroke="#ffd7ba" strokeWidth="3" strokeLinecap="round" />
                    {/* Smartphone */}
                    <rect x="36" y="44" width="14" height="24" rx="3" fill="#1e1b4b" />
                    <rect x="38" y="46" width="10" height="18" rx="1.5" fill="#38bdf8" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Widget 2: Recent Searches Card */}
            <div className="jobs-recent-card" id="recent-searches-widget">
              <div className="jobs-recent-card__header">
                <h3 className="jobs-recent-card__title">Recent Searches</h3>
                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    className="jobs-recent-card__clear-btn"
                    onClick={handleClearRecentSearches}
                    id="clear-all-recent-searches"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="jobs-recent-card__list">
                {recentSearches.length === 0 ? (
                  <p className="jobs-recent-card__empty">No recent searches</p>
                ) : (
                  recentSearches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="jobs-recent-item"
                      onClick={() => {
                        setSearchTitle(item.query)
                        setAppliedSearchTitle(item.query)
                      }}
                    >
                      <History size={16} className="jobs-recent-item__icon" />
                      <div className="jobs-recent-item__info">
                        <span className="jobs-recent-item__query">{item.query}</span>
                        <span className="jobs-recent-item__loc">{item.location}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Widget 3: Stand Out / Resume Promotion Card */}
            <div className="jobs-resume-card" id="resume-promotion-widget">
              <h3 className="jobs-resume-card__title">Stand out from the crowd</h3>
              <p className="jobs-resume-card__subtitle">
                Add your resume and get noticed by top employers.
              </p>

              <button type="button" className="jobs-resume-card__btn" id="upload-resume-btn">
                Upload Resume
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
