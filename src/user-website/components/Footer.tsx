export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand column */}
          <div className="footer__brand" id="footer-brand">
            <div className="footer__brand-name">
              Job<span>Risers</span>
            </div>
            <p className="footer__brand-desc">
              Empowering top-tier candidates with AI-powered matching, bespoke
              resume tooling, and enterprise recruiter access.
            </p>
            <div className="footer__status">
              <span className="footer__status-dot" />
              Network Operational
            </div>
          </div>

          {/* Platform */}
          <div id="footer-platform">
            <h4 className="footer__column-title">Platform</h4>
            <div className="footer__links">
              <a href="#">Find Jobs</a>
              <a href="#">Featured Companies</a>
              <a href="#">Talent Network</a>
              <a href="#">Salary Benchmark</a>
            </div>
          </div>

          {/* Career Tools */}
          <div id="footer-career-tools">
            <h4 className="footer__column-title">Career Tools</h4>
            <div className="footer__links">
              <a href="#">Resume Builder</a>
              <a href="#">Career Advice</a>
              <a href="#">Interview Prep</a>
              <a href="#">AI Cover Letters</a>
            </div>
          </div>

          {/* Legal & Trust */}
          <div id="footer-legal">
            <h4 className="footer__column-title">Legal &amp; Trust</h4>
            <div className="footer__links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security &amp; Compliance</a>
              <a href="#">Candidate Rights</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom" id="footer-bottom">
          <p className="footer__copyright">
            &copy; 2025 JobRisers Inc. All rights reserved.
          </p>
          <p className="footer__tagline">
            Institutional Grade Career Infrastructure
          </p>
        </div>
      </div>
    </footer>
  )
}
