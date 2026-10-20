const categories = [
  {
    name: 'Technology',
    count: '12,000+ jobs',
    variant: 'tech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    name: 'Marketing',
    count: '4,500+ jobs',
    variant: 'marketing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    name: 'Finance',
    count: '6,800+ jobs',
    variant: 'finance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    name: 'Healthcare',
    count: '5,200+ jobs',
    variant: 'healthcare',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    name: 'Design',
    count: '3,900+ jobs',
    variant: 'design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2Z" />
      </svg>
    ),
  },
  {
    name: 'Human Resources',
    count: '2,300+ jobs',
    variant: 'hr',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function CategoriesSection() {
  return (
    <section className="categories" id="categories-section">
      <div className="container">
        <div className="categories__header">
          <p className="categories__eyebrow">EXPLORE OPPORTUNITIES</p>
          <div className="categories__title-row">
            <div>
              <h2 className="categories__title">Browse jobs by category</h2>
              <p className="categories__desc">
                Find roles in your field or explore something new.
              </p>
            </div>
            <a href="#" className="categories__view-all" id="view-all-categories">
              View all categories
            </a>
          </div>
        </div>

        <div className="categories__grid">
          {categories.map((cat) => (
            <div
              className={`category-card category-card--${cat.variant}`}
              key={cat.name}
              id={`category-${cat.variant}`}
            >
              <div className="category-card__icon">{cat.icon}</div>
              <div className="category-card__name">{cat.name}</div>
              <div className="category-card__count">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
