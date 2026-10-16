export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      <div className="container">
        {/* Left content */}
        <div className="hero__content">
          <p className="hero__eyebrow">BETTER JOBS. BRIGHTER FUTURES.</p>

          <h1 className="hero__title">
            Find a job that
            <br />
            fits <span className="highlight">your life</span>
          </h1>

          <p className="hero__subtitle">
            Discover thousands of jobs from top companies. Apply easily,
            track your progress, and take the next step in your career.
          </p>

          {/* Search bar */}
          <div className="hero__search" id="hero-search">
            <div className="hero__search-field">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Job title, skills, or company"
                id="search-job-input"
              />
            </div>

            <div className="hero__search-divider" />

            <div className="hero__search-field">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                placeholder="Location"
                id="search-location-input"
              />
            </div>

            <button className="hero__search-btn" id="search-jobs-btn">
              Search Jobs
            </button>
          </div>

          {/* Popular searches */}
          <div className="hero__popular" id="popular-searches">
            <span className="hero__popular-label">Popular searches:</span>
            {['Remote', 'Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing', 'Design'].map(
              (tag) => (
                <button key={tag} className="hero__chip">
                  {tag}
                </button>
              ),
            )}
          </div>

          {/* Trusted companies */}
          <div className="hero__trusted" id="trusted-companies">
            <p className="hero__trusted-label">Trusted by leading companies</p>
            <div className="hero__logos">
              {/* Amazon */}
              <span className="hero__logo-item" style={{ fontFamily: "'Amazon Ember', Arial, sans-serif", fontWeight: 800, letterSpacing: '-0.5px' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.064 2.729 1.59 5.744 2.382 9.033 2.382 2.612 0 5.104-.505 7.49-1.524.261-.101.47-.175.629-.175.281 0 .421.178.421.534 0 .169-.066.355-.197.567-.301.455-1.023.936-2.166 1.449-1.393.627-2.945 1.074-4.656 1.34-.746.11-1.444.166-2.098.166-2.009 0-3.871-.381-5.581-1.136C1.878 20.88.821 20.075.045 19.08v-1.06z"/>
                  <path d="M6.394 14.66c0-.81.2-1.52.598-2.128.4-.61.958-1.073 1.68-1.394.76-.34 1.673-.566 2.734-.682.37-.04.963-.09 1.776-.15v-.47c0-.65-.09-1.09-.268-1.32-.298-.4-.78-.6-1.447-.6h-.178c-.47.03-.874.16-1.213.39-.34.23-.566.57-.683 1.02-.09.296-.24.47-.45.52l-2.54-.31c-.27-.07-.4-.21-.4-.42 0-.06.01-.13.04-.2.32-1.63 1.66-2.45 4.02-2.45h.73c1.05.01 1.88.3 2.51.85.23.21.43.46.59.77.16.31.27.58.31.82.04.24.07.59.07 1.06v4.47c0 .41.1.77.3 1.09.2.32.35.52.44.6.09.08.18.19.27.32.1.15.14.28.14.38 0 .18-.09.34-.28.49l-1.69 1.43c-.22.15-.41.22-.58.22-.2 0-.4-.1-.58-.29-.48-.53-.82-.97-1.01-1.33a5.76 5.76 0 0 1-1.57 1.22c-.63.34-1.34.51-2.11.51-1.12 0-2.04-.35-2.76-1.06-.72-.71-1.08-1.62-1.08-2.74zm3.5-.4c0 .53.15.95.44 1.28.3.33.67.49 1.13.49.05 0 .13-.01.24-.04.11-.03.17-.04.2-.04.62-.25 1.08-.68 1.38-1.29.18-.36.29-.72.34-1.08.04-.36.07-.86.07-1.51v-.74c-.71.06-1.27.13-1.67.2-.95.2-1.6.55-1.94 1.06-.21.33-.32.73-.32 1.2l.13.37z"/>
                  <path d="M20.07 14.47c0 .18.06.35.17.5.1.16.27.3.5.42.67.36.67.8 0 1.34-.34.27-.73.54-1.18.8-.44.26-.78.4-1.02.4-.34 0-.66-.2-.95-.58-.3-.4-.56-.69-.79-.88-.81.97-1.92 1.46-3.32 1.46-1.15 0-2.1-.37-2.84-1.1-.74-.74-1.11-1.68-1.11-2.82 0-1.36.49-2.42 1.47-3.16.98-.75 2.32-1.17 4.01-1.28l1.81-.12v-.56c0-1.16-.56-1.74-1.68-1.74-.93 0-1.62.38-2.06 1.13-.2.34-.43.52-.67.52-.06 0-.12-.01-.2-.03l-2.42-.36c-.22-.06-.33-.17-.33-.33 0-.03.01-.07.03-.13.37-1.07 1.01-1.9 1.92-2.49.91-.58 2.01-.87 3.3-.87 1.46 0 2.6.38 3.43 1.14.59.55.91 1.2.96 1.95.02.18.03.57.03 1.17v4.32c0 .68.16 1.05.47 1.1z"/>
                </svg>
                amazon
              </span>

              {/* Adobe */}
              <span className="hero__logo-item" style={{ fontWeight: 700 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425h-3.71zm-6.37 0H1.598L9.594 1.376l-1.998 21.248zM16.404 1.376L24 22.624h-5.998l-1.598-21.248z"/>
                </svg>
                Adobe
              </span>

              {/* Microsoft */}
              <span className="hero__logo-item" style={{ fontWeight: 600, fontSize: '20px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                  <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                  <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                  <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
                </svg>
                Microsoft
              </span>

              {/* Infosys */}
              <span className="hero__logo-item" style={{ fontWeight: 700, fontStyle: 'italic' }}>
                Infosys
              </span>

              {/* TATA */}
              <span className="hero__logo-item" style={{ fontWeight: 700, letterSpacing: '1px', fontSize: '18px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M7 8h10M12 8v10" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                TATA
              </span>
            </div>
          </div>
        </div>

        {/* Right — hero image */}
        <div className="hero__image" id="hero-image">
          <img
            src="/hero-woman.png"
            alt="Professional woman holding a laptop, ready to start her career"
            loading="eager"
          />

          {/* Floating card — 50K+ Jobs */}
          <div className="hero__float-card hero__float-card--jobs" id="float-card-jobs">
            <div className="icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="text">
              <strong>50K+</strong>
              <span>Jobs Added Every Month</span>
            </div>
          </div>

          {/* Social proof pill */}
          <div className="hero__social-proof" id="social-proof-pill">
            <div className="avatars">
              <div className="avatar" style={{ background: '#6366f1' }}>A</div>
              <div className="avatar" style={{ background: '#f59e0b' }}>B</div>
              <div className="avatar" style={{ background: '#22c55e' }}>C</div>
            </div>
            <div className="proof-text">
              Join thousands of professionals
              <br />
              growing with <strong>JobNest</strong>
            </div>
          </div>

          {/* Handwritten note */}
          <div className="hero__handwritten">
            <p>
              Your next<br />
              opportunity is here.
            </p>
            <svg viewBox="0 0 44 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M38 4 C 26 14, 14 26, 6 26" />
              <path d="M 14 19 L 6 26 L 13 31" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
