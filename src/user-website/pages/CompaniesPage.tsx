import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Check } from 'lucide-react'
import '../styles/companies.css'

export interface CompanyItem {
  id: string
  name: string
  tagline: string
  location: string
  employees: string
  openJobs: string
  logoType: 'google' | 'microsoft' | 'amazon' | 'adobe' | 'spotify' | 'deloitte' | 'flipkart' | 'infosys'
  logoText?: string
  industry: string
  sizeCategory: string
}

const ALL_COMPANIES: CompanyItem[] = [
  {
    id: 'google',
    name: 'Google',
    tagline: 'Build for everyone',
    location: 'Bengaluru, India',
    employees: '100K+ employees',
    openJobs: '245 open jobs',
    logoType: 'google',
    logoText: 'G',
    industry: 'Technology',
    sizeCategory: '5,001+',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    tagline: 'Empower every person',
    location: 'Hyderabad, India',
    employees: '200K+ employees',
    openJobs: '180 open jobs',
    logoType: 'microsoft',
    industry: 'Technology',
    sizeCategory: '5,001+',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    tagline: 'Work hard. Have fun.',
    location: 'Bengaluru, India',
    employees: '1M+ employees',
    openJobs: '320 open jobs',
    logoType: 'amazon',
    logoText: 'a',
    industry: 'E-commerce',
    sizeCategory: '5,001+',
  },
  {
    id: 'adobe',
    name: 'Adobe',
    tagline: 'Creativity changes everything',
    location: 'Noida, India',
    employees: '29K+ employees',
    openJobs: '95 open jobs',
    logoType: 'adobe',
    logoText: 'A',
    industry: 'Technology',
    sizeCategory: '5,001+',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    tagline: 'Music for everyone',
    location: 'Bengaluru, India',
    employees: '8K+ employees',
    openJobs: '56 open jobs',
    logoType: 'spotify',
    industry: 'Technology',
    sizeCategory: '5,001+',
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    tagline: 'Make an impact that matters',
    location: 'Mumbai, India',
    employees: '450K+ employees',
    openJobs: '120 open jobs',
    logoType: 'deloitte',
    logoText: 'D.',
    industry: 'Finance',
    sizeCategory: '5,001+',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    tagline: 'A better everyday',
    location: 'Bengaluru, India',
    employees: '30K+ employees',
    openJobs: '88 open jobs',
    logoType: 'flipkart',
    logoText: 'fk',
    industry: 'E-commerce',
    sizeCategory: '5,001+',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    tagline: 'Navigate your next',
    location: 'Bengaluru, India',
    employees: '300K+ employees',
    openJobs: '130 open jobs',
    logoType: 'infosys',
    logoText: 'Infosys',
    industry: 'Technology',
    sizeCategory: '5,001+',
  },
]

export default function CompaniesPage() {
  const navigate = useNavigate()

  // Search inputs
  const [searchName, setSearchName] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedLocation, setAppliedLocation] = useState('')

  // Industry filters (Exact states from screenshot: Technology & Finance checked)
  const [industries, setIndustries] = useState<{ [key: string]: boolean }>({
    Technology: true,
    Healthcare: false,
    Finance: true,
    Education: false,
    'E-commerce': false,
  })

  // Company size filters (Exact states: 1-50 & 51-200 checked)
  const [companySizes, setCompanySizes] = useState<{ [key: string]: boolean }>({
    '1-50': true,
    '51-200': true,
    '201-1,000': false,
    '1,001-5,000': false,
    '5,001+': false,
  })

  // Location filters (Exact states: all 5 checked)
  const [locations, setLocations] = useState<{ [key: string]: boolean }>({
    Bengaluru: true,
    Hyderabad: true,
    Mumbai: true,
    'Delhi NCR': true,
    Remote: true,
  })

  // Show more industry toggle
  const [showMoreIndustry, setShowMoreIndustry] = useState(false)

  // Sort dropdown
  const [sortBy, setSortBy] = useState('Most Relevant')
  const [sortOpen, setSortOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAppliedName(searchName)
    setAppliedLocation(searchLocation)
    setCurrentPage(1)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchName('')
    setSearchLocation('')
    setAppliedName('')
    setAppliedLocation('')
    setIndustries({
      Technology: true,
      Healthcare: false,
      Finance: true,
      Education: false,
      'E-commerce': false,
    })
    setCompanySizes({
      '1-50': true,
      '51-200': true,
      '201-1,000': false,
      '1,001-5,000': false,
      '5,001+': false,
    })
    setLocations({
      Bengaluru: true,
      Hyderabad: true,
      Mumbai: true,
      'Delhi NCR': true,
      Remote: true,
    })
    setCurrentPage(1)
  }

  // Filter logic
  const filteredCompanies = useMemo(() => {
    return ALL_COMPANIES.filter((company) => {
      if (appliedName.trim()) {
        const query = appliedName.toLowerCase()
        if (!company.name.toLowerCase().includes(query)) return false
      }
      if (appliedLocation.trim()) {
        const query = appliedLocation.toLowerCase()
        if (!company.location.toLowerCase().includes(query)) return false
      }
      return true
    })
  }, [appliedName, appliedLocation])

  return (
    <div className="companies-page-root">
      {/* ------------------------------------------------------------------
          1. Header / Navigation Bar (Matches Screenshot)
          ------------------------------------------------------------------ */}
      <header className="companies-nav" id="companies-header-nav">
        <div className="companies-nav__container">
          {/* Logo */}
          <Link to="/" className="companies-nav__logo" id="companies-nav-logo">
            <img
              src="/jobrisers-logo.svg"
              alt="JobRisers"
              width="30"
              height="30"
              className="companies-nav__logo-img"
            />
            <span className="companies-nav__logo-text">
              <span className="companies-nav__logo-text--job">Job</span>
              <span className="companies-nav__logo-text--risers">Risers</span>
            </span>
          </Link>

          {/* Links: Companies has active purple underline bar */}
          <nav className="companies-nav__links">
            <Link to="/jobs" className="companies-nav__link" id="nav-jobs">
              Jobs
            </Link>
            <Link to="/companies" className="companies-nav__link companies-nav__link--active" id="nav-companies">
              Companies
            </Link>
            <Link to="/#career-advice" className="companies-nav__link" id="nav-career-advice">
              Career Advice
            </Link>
            <Link to="/#for-employers" className="companies-nav__link" id="nav-employers">
              For Employers
            </Link>
          </nav>

          {/* Logged-in User: AJ and Alex Johnson */}
          <Link
            to="/settings"
            className="companies-nav__user"
            id="companies-user-profile"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="companies-nav__avatar" aria-hidden="true">
              AJ
            </div>
            <span className="companies-nav__username">Alex Johnson</span>
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------------
          2. Companies Hero Section
          ------------------------------------------------------------------ */}
      <section className="companies-hero" id="companies-hero-section">
        <div className="companies-hero__inner">
          {/* Left Text & Horizontal Search Bar */}
          <div className="companies-hero__left">
            <p className="companies-hero__eyebrow">TOP COMPANIES. BRIGHTER FUTURES.</p>
            <h1 className="companies-hero__title">
              Explore <span className="companies-hero__highlight">Companies</span>
            </h1>
            <p className="companies-hero__subtitle">
              Discover top companies, learn about their culture, and find the right place to grow your career.
            </p>

            {/* Horizontal Search Bar across the banner */}
            <form className="companies-search-bar" onSubmit={handleSearchSubmit} id="companies-search-form">
              <div className="companies-search-bar__field companies-search-bar__field--main">
                <Search className="companies-search-bar__icon" size={17} />
                <input
                  type="text"
                  placeholder="Search companies (e.g. Google, Microsoft, Amazon)"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="companies-search-bar__input"
                  id="search-company-name-input"
                />
              </div>

              <div className="companies-search-bar__divider" />

              <div className="companies-search-bar__field companies-search-bar__field--loc">
                <MapPin className="companies-search-bar__icon" size={17} />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="companies-search-bar__input"
                  id="search-company-loc-input"
                />
              </div>

              <button
                type="submit"
                className="companies-search-bar__btn"
                id="search-companies-btn"
              >
                Search Companies
              </button>
            </form>
          </div>

          {/* Right Vector Artwork matching Screenshot */}
          <div className="companies-hero__artwork" aria-hidden="true">
            <svg
              viewBox="0 0 600 210"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="companies-hero-svg"
            >
              {/* Floating Filter by Industry Card on the Left */}
              <g transform="translate(10, 24)">
                <rect width="136" height="125" rx="8" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1" />
                <rect x="10" y="10" width="18" height="18" rx="4" fill="#6366f1" />
                <path d="M14 15l4 4v3l2-1v-2l4-4h-10z" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <text x="34" y="20" fill="#1e1b4b" fontSize="7.5" fontWeight="700">Filter by Industry</text>
                <text x="34" y="27" fill="#6366f1" fontSize="6" fontWeight="600">Fastest Growing</text>

                <rect x="10" y="34" width="116" height="15" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8" />
                <circle cx="17" cy="41.5" r="2.5" fill="#94a3b8" />
                <line x1="19" y1="43.5" x2="21" y2="45.5" stroke="#94a3b8" strokeWidth="0.8" />
                <text x="25" y="44" fill="#94a3b8" fontSize="6">Search for specific companies...</text>

                {/* 6 small company app logo tiles */}
                <rect x="10" y="58" width="18" height="18" rx="4" fill="#0f172a" />
                <circle cx="19" cy="67" r="4" fill="#38bdf8" />

                <rect x="34" y="58" width="18" height="18" rx="4" fill="#f0fdf4" stroke="#86efac" />
                <path d="M40 67l2 2 4-4" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" />

                <rect x="58" y="58" width="18" height="18" rx="4" fill="#fef2f2" stroke="#fca5a5" />
                <text x="63" y="70" fill="#ef4444" fontSize="8" fontWeight="800">A</text>

                <rect x="10" y="84" width="18" height="18" rx="4" fill="#ede9fe" />
                <circle cx="19" cy="93" r="4" fill="#7c3aed" />

                <rect x="34" y="84" width="18" height="18" rx="4" fill="#e0f2fe" />
                <path d="M38 97v-6M43 97v-8M48 97v-4" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />

                <rect x="58" y="84" width="18" height="18" rx="4" fill="#fffbeb" stroke="#fde047" />
                <circle cx="67" cy="93" r="4" fill="#d97706" />
              </g>

              {/* Heading Text in Center */}
              <text x="165" y="90" fill="#0f172a" fontSize="26" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="-0.5">
                Great companies
              </text>
              <text x="165" y="122" fill="#0f172a" fontSize="26" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="-0.5">
                build great people
              </text>

              {/* Floating Tags on the Upper Right */}
              <g transform="translate(450, 12)">
                <rect x="2" y="2" width="110" height="17" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" />
                <circle cx="10" cy="10.5" r="3" fill="#cbd5e1" />
                <text x="17" y="13.5" fill="#64748b" fontSize="7.5" fontWeight="600">Discover Opportunities</text>

                <rect x="18" y="24" width="78" height="17" rx="8.5" fill="#f0fdf4" stroke="#bbf7d0" />
                <circle cx="26" cy="32.5" r="3" fill="#86efac" />
                <text x="33" y="35.5" fill="#16a34a" fontSize="7.5" fontWeight="600">Learn Skills</text>

                <rect x="24" y="46" width="76" height="17" rx="8.5" fill="#fef2f2" stroke="#fecaca" />
                <circle cx="32" cy="54.5" r="3" fill="#fca5a5" />
                <text x="39" y="57.5" fill="#ef4444" fontSize="7.5" fontWeight="600">Build Future</text>

                <text x="16" y="74" fill="#94a3b8" fontSize="7">and other empty tags</text>
              </g>

              {/* Desk surface */}
              <rect x="360" y="166" width="240" height="44" rx="4" fill="#ded7fc" />
              <line x1="360" y1="166" x2="600" y2="166" stroke="#c4b5fd" strokeWidth="2" />

              {/* Potted Plant on far right */}
              <g transform="translate(545, 130)">
                <path d="M6 36 L 22 36 L 26 18 L 2 18 Z" fill="#93c5fd" />
                <ellipse cx="14" cy="18" rx="12" ry="3" fill="#60a5fa" />
                <path d="M14 18 C 10 8, 4 4, 0 10 C 2 4, 12 6, 14 18 Z" fill="#22c55e" />
                <path d="M14 18 C 18 6, 24 4, 28 8 C 24 4, 16 8, 14 18 Z" fill="#16a34a" />
                <path d="M14 18 C 14 4, 18 0, 18 0 C 12 2, 12 10, 14 18 Z" fill="#15803d" />
              </g>

              {/* Young Man Character resting head in hands looking left */}
              <g transform="translate(410, 50)">
                {/* Back Hair */}
                <path
                  d="M36 30 C 32 14, 46 2, 66 4 C 84 6, 92 16, 90 32 C 94 48, 88 72, 82 82 C 78 78, 78 62, 80 50 C 76 38, 48 38, 42 52 C 40 62, 38 78, 34 82 C 30 72, 32 44, 36 30 Z"
                  fill="#1e1035"
                />

                {/* Torso & Purple Sweater */}
                <path
                  d="M26 84 C 26 66, 42 54, 62 54 C 82 54, 98 66, 98 84 L 104 116 L 20 116 Z"
                  fill="#5b21b6"
                />
                {/* Collar */}
                <polygon points="62,60 52,54 72,54" fill="#ffffff" />

                {/* Neck */}
                <rect x="56" y="44" width="12" height="14" fill="#ffd7ba" rx="3" />

                {/* Head / Face */}
                <ellipse cx="62" cy="35" rx="16" ry="18" fill="#ffd7ba" />

                {/* Eyes - looking to the left thoughtfully */}
                <ellipse cx="54" cy="34" rx="2" ry="2.2" fill="#1e1b4b" />
                <ellipse cx="68" cy="34" rx="2" ry="2.2" fill="#1e1b4b" />
                <circle cx="53" cy="33" r="0.7" fill="#ffffff" />
                <circle cx="67" cy="33" r="0.7" fill="#ffffff" />
                {/* Eyebrows */}
                <path d="M51 28 C 53 26, 57 27, 59 29" stroke="#1e1b4b" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M63 29 C 65 27, 69 26, 71 28" stroke="#1e1b4b" strokeWidth="1.2" strokeLinecap="round" />
                {/* Thoughtful slight smile */}
                <path d="M57 42 C 60 44, 64 44, 66 42" stroke="#e11d48" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                {/* Rosy Cheeks */}
                <ellipse cx="50" cy="38" rx="3" ry="1.5" fill="#f43f5e" opacity="0.35" />
                <ellipse cx="72" cy="38" rx="3" ry="1.5" fill="#f43f5e" opacity="0.35" />

                {/* Hands resting on chin */}
                <ellipse cx="55" cy="48" rx="6" ry="4" fill="#ffd7ba" />
                <ellipse cx="68" cy="48" rx="6" ry="4" fill="#ffd7ba" />

                {/* Front Hair / Bangs */}
                <path
                  d="M44 24 C 52 13, 72 15, 78 24 C 72 20, 58 19, 48 24 Z"
                  fill="#2e1065"
                />
                <path
                  d="M42 25 C 40 32, 40 40, 43 45 C 41 40, 42 32, 44 26 Z"
                  fill="#2e1065"
                />

                {/* Purple Laptop on Desk */}
                <g transform="translate(15, 102)">
                  <rect x="25" y="0" width="55" height="34" rx="4" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.5" />
                  <rect x="28" y="3" width="49" height="28" rx="2" fill="#c4b5fd" />
                  <polygon points="18,34 87,34 82,39 23,39" fill="#a78bfa" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Main Content: Left Filters & Right Company Cards Grid
          ------------------------------------------------------------------ */}
      <main className="companies-main">
        <div className="companies-main__container">
          {/* ================================================================
              LEFT COLUMN — FILTERS SIDEBAR
              ================================================================ */}
          <aside className="companies-filter-sidebar" aria-label="Filters">
            <div className="companies-filter-card">
              {/* Header */}
              <div className="companies-filter-card__header">
                <h2 className="companies-filter-card__title">Filters</h2>
                <button
                  type="button"
                  className="companies-filter-card__clear-btn"
                  onClick={handleClearFilters}
                  id="clear-all-filters-btn"
                >
                  Clear all
                </button>
              </div>

              {/* 1. Industry */}
              <div className="companies-filter-group">
                <h3 className="companies-filter-group__title">Industry</h3>
                <div className="companies-filter-group__list">
                  {(['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce'] as const).map((ind) => (
                    <label key={ind} className="companies-filter-item">
                      <span className="companies-checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={industries[ind]}
                          onChange={(e) =>
                            setIndustries((prev) => ({ ...prev, [ind]: e.target.checked }))
                          }
                        />
                        <span className="companies-checkbox-custom">
                          {industries[ind] && <Check size={12} strokeWidth={3} />}
                        </span>
                      </span>
                      <span className="companies-filter-item__label">{ind}</span>
                    </label>
                  ))}

                  {/* Show more toggle */}
                  <button
                    type="button"
                    className="companies-filter-show-more"
                    onClick={() => setShowMoreIndustry(!showMoreIndustry)}
                  >
                    {showMoreIndustry ? 'Show less' : 'Show more'}
                  </button>

                  {showMoreIndustry && (
                    <div className="companies-filter-more-items">
                      {(['Manufacturing', 'Retail', 'Media'] as const).map((ind) => (
                        <label key={ind} className="companies-filter-item">
                          <span className="companies-checkbox-wrap">
                            <input type="checkbox" />
                            <span className="companies-checkbox-custom" />
                          </span>
                          <span className="companies-filter-item__label">{ind}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="companies-filter-divider" />

              {/* 2. Company Size */}
              <div className="companies-filter-group">
                <h3 className="companies-filter-group__title">Company Size</h3>
                <div className="companies-filter-group__list">
                  {(['1-50', '51-200', '201-1,000', '1,001-5,000', '5,001+'] as const).map((size) => (
                    <label key={size} className="companies-filter-item">
                      <span className="companies-checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={companySizes[size]}
                          onChange={(e) =>
                            setCompanySizes((prev) => ({ ...prev, [size]: e.target.checked }))
                          }
                        />
                        <span className="companies-checkbox-custom">
                          {companySizes[size] && <Check size={12} strokeWidth={3} />}
                        </span>
                      </span>
                      <span className="companies-filter-item__label">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="companies-filter-divider" />

              {/* 3. Location */}
              <div className="companies-filter-group">
                <h3 className="companies-filter-group__title">Location</h3>
                <div className="companies-filter-group__list">
                  {(['Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Remote'] as const).map((loc) => (
                    <label key={loc} className="companies-filter-item">
                      <span className="companies-checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={locations[loc]}
                          onChange={(e) =>
                            setLocations((prev) => ({ ...prev, [loc]: e.target.checked }))
                          }
                        />
                        <span className="companies-checkbox-custom">
                          {locations[loc] && <Check size={12} strokeWidth={3} />}
                        </span>
                      </span>
                      <span className="companies-filter-item__label">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================================
              RIGHT COLUMN — COMPANY RESULTS & FOUR-COLUMN GRID
              ================================================================ */}
          <section className="companies-results-section" aria-label="Company Listings">
            {/* Header: Count & Sort */}
            <div className="companies-results-header">
              <span className="companies-results-count" id="companies-count">
                {appliedName || appliedLocation
                  ? `${filteredCompanies.length} companies`
                  : '312 companies'}
              </span>

              <div className="companies-sort-wrap">
                <span className="companies-sort-label">Sort by:</span>
                <div className="companies-sort-dropdown">
                  <button
                    type="button"
                    className="companies-sort-btn"
                    onClick={() => setSortOpen(!sortOpen)}
                    id="companies-sort-btn"
                  >
                    <span>{sortBy}</span>
                    <span className="companies-sort-arrow">▲</span>
                  </button>

                  {sortOpen && (
                    <div className="companies-sort-menu">
                      {['Most Relevant', 'Most Open Jobs', 'Alphabetical'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`companies-sort-menu-item ${sortBy === opt ? 'companies-sort-menu-item--active' : ''}`}
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
            </div>

            {/* Four-Column Grid of 8 Company Cards */}
            <div className="companies-grid">
              {filteredCompanies.map((company) => (
                <article
                  key={company.id}
                  className="company-card"
                  id={`company-card-${company.id}`}
                >
                  {/* Card Header with Logo */}
                  <div className="company-card__header">
                    <div className={`company-card__logo company-card__logo--${company.logoType}`}>
                      {company.logoType === 'microsoft' ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect width="9" height="9" fill="#F25022" />
                          <rect x="11" width="9" height="9" fill="#7FBA00" />
                          <rect y="11" width="9" height="9" fill="#00A4EF" />
                          <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                        </svg>
                      ) : company.logoType === 'spotify' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#15803d">
                          <circle cx="12" cy="12" r="10" fill="#15803d" />
                          <path
                            d="M7 9.5c3.2-1 6.8-.7 10 .8M7.8 12.5c2.6-.8 5.6-.6 8.2.6M8.6 15.5c2-.5 4.3-.4 6.3.5"
                            stroke="#ffffff"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : company.logoType === 'deloitte' ? (
                        <span className="company-card__logo-deloitte">
                          D<span className="company-card__logo-deloitte-dot">.</span>
                        </span>
                      ) : company.logoType === 'infosys' ? (
                        <span className="company-card__logo-infosys">Infosys</span>
                      ) : (
                        <span>{company.logoText}</span>
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <h3 className="company-card__name">{company.name}</h3>
                  <p className="company-card__tagline">{company.tagline}</p>

                  {/* Specs / Meta */}
                  <div className="company-card__meta">
                    <span className="company-card__meta-item">{company.location}</span>
                    <span className="company-card__meta-item">{company.employees}</span>
                    <span className="company-card__meta-item">{company.openJobs}</span>
                  </div>

                  {/* View Jobs Button */}
                  <button
                    type="button"
                    className="company-card__btn"
                    onClick={() => navigate(`/jobs?company=${company.name}`)}
                    id={`view-jobs-btn-${company.id}`}
                  >
                    View Jobs
                  </button>
                </article>
              ))}
            </div>

            {/* Bottom Pagination */}
            <div className="companies-pagination" id="companies-pagination">
              <button
                type="button"
                className="companies-pagination__arrow"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                aria-label="Previous Page"
              >
                ◀
              </button>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 1 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 2 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 3 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 4 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(4)}
              >
                4
              </button>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 5 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(5)}
              >
                5
              </button>

              <span className="companies-pagination__ellipsis">...</span>

              <button
                type="button"
                className={`companies-pagination__page ${currentPage === 40 ? 'companies-pagination__page--active' : ''}`}
                onClick={() => setCurrentPage(40)}
              >
                40
              </button>

              <button
                type="button"
                className="companies-pagination__arrow"
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Next Page"
              >
                ▶
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
