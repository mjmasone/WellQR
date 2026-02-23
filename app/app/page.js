export const metadata = {
  title: 'WellQR — Put the Appointment in Their Calendar',
  description: 'Reduce patient no-shows with a scannable QR code at checkout. $49/month, device included.',
};

export default function Landing() {
  return (
    <>
      <style>{`
        :root {
          --ink: #1a1a2e;
          --ink-light: #4a4a5a;
          --ink-muted: #7a7a8a;
          --blue: #4f46e5;
          --blue-dark: #4338ca;
          --blue-light: #e0e7ff;
          --blue-wash: #eef2ff;
          --warm: #fafaf8;
          --white: #ffffff;
          --border: #e8e8ec;
          --red-text: #b91c1c;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', -apple-system, sans-serif;
          color: var(--ink);
          background: var(--white);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
        }

        /* NAV */
        .ln-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ln-nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: var(--blue);
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .ln-nav-logo span { color: var(--ink); }
        .ln-nav-links { display: flex; align-items: center; gap: 1.5rem; }
        .ln-nav-link {
          font-size: 0.875rem;
          color: var(--ink-light);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .ln-nav-link:hover { color: var(--blue); }
        .ln-nav-cta {
          background: var(--blue);
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .ln-nav-cta:hover { background: var(--blue-dark); }

        /* HERO */
        .ln-hero {
          padding: 10rem 2rem 6rem;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .ln-hero-tag {
          display: inline-block;
          background: var(--blue-wash);
          color: var(--blue-dark);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 1rem;
          border-radius: 100px;
          margin-bottom: 2rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ln-hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          line-height: 1.12;
          letter-spacing: -0.025em;
          color: var(--ink);
          margin-bottom: 1.5rem;
        }
        .ln-hero h1 em {
          font-style: normal;
          color: var(--blue);
        }
        .ln-hero p {
          font-size: 1.2rem;
          color: var(--ink-light);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .ln-cta {
          display: inline-block;
          background: var(--blue);
          color: white;
          padding: 0.9rem 2.25rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 600;
          transition: background 0.2s, transform 0.15s;
        }
        .ln-cta:hover { background: var(--blue-dark); transform: translateY(-1px); }

        /* PROBLEM */
        .ln-problem {
          background: var(--warm);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 5rem 2rem;
        }
        .ln-problem-inner { max-width: 880px; margin: 0 auto; }
        .ln-section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
          text-align: center;
        }
        .ln-problem-text {
          font-size: 1.1rem;
          color: var(--ink-light);
          max-width: 680px;
          margin: 0 auto 3rem;
          text-align: center;
          line-height: 1.75;
        }
        .ln-stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          max-width: 750px;
          margin: 0 auto;
        }
        .ln-stat-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 2rem 1.5rem;
          text-align: center;
        }
        .ln-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem;
          color: var(--red-text);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .ln-stat-label {
          font-size: 0.95rem;
          color: var(--ink-muted);
          line-height: 1.5;
        }

        /* HOW IT WORKS */
        .ln-how {
          padding: 6rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .ln-how-sub {
          text-align: center;
          color: var(--ink-muted);
          font-size: 1.1rem;
          margin-bottom: 3.5rem;
        }
        .ln-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
        }
        .ln-step { text-align: center; }
        .ln-step-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--blue-wash);
          color: var(--blue);
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 1.25rem;
        }
        .ln-step h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .ln-step p {
          font-size: 0.95rem;
          color: var(--ink-light);
          line-height: 1.6;
        }

        /* ADVANTAGES */
        .ln-advantages {
          background: var(--ink);
          color: white;
          padding: 6rem 2rem;
        }
        .ln-advantages-inner { max-width: 900px; margin: 0 auto; }
        .ln-advantages .ln-section-title { color: white; margin-bottom: 3.5rem; }
        .ln-adv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .ln-adv-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 2rem;
        }
        .ln-adv-icon { font-size: 1.5rem; margin-bottom: 1rem; display: block; }
        .ln-adv-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.6rem;
          color: var(--blue-light);
        }
        .ln-adv-card p {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.65;
        }

        /* COMPARE */
        .ln-compare {
          padding: 6rem 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .ln-compare-sub {
          text-align: center;
          color: var(--ink-muted);
          font-size: 1.05rem;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }
        .ln-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        .ln-table th {
          text-align: left;
          font-weight: 600;
          padding: 0.9rem 1rem;
          border-bottom: 2px solid var(--ink);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-muted);
        }
        .ln-table th:last-child { color: var(--blue); }
        .ln-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--ink-light);
        }
        .ln-table tr td:last-child { color: var(--ink); font-weight: 500; }
        .ln-check { color: var(--blue); font-weight: 700; }
        .ln-x { color: #ccc; }

        /* MESSAGING */
        .ln-messaging {
          background: var(--blue-wash);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 5rem 2rem;
        }
        .ln-messaging-inner { max-width: 750px; margin: 0 auto; text-align: center; }
        .ln-messaging p {
          font-size: 1.05rem;
          color: var(--ink-light);
          line-height: 1.75;
          margin-bottom: 1.25rem;
        }
        .ln-msg-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .ln-msg-tag {
          background: var(--white);
          border: 1px solid var(--border);
          padding: 0.45rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--ink-light);
        }

        /* PRICING */
        .ln-pricing {
          padding: 6rem 2rem;
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .ln-price-card {
          background: var(--white);
          border: 2px solid var(--ink);
          border-radius: 16px;
          padding: 3rem 2.5rem;
          text-align: center;
        }
        .ln-price-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 3.5rem;
          color: var(--ink);
          line-height: 1;
        }
        .ln-price-amount span {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          color: var(--ink-muted);
          font-weight: 400;
        }
        .ln-price-desc {
          color: var(--ink-muted);
          margin: 0.75rem 0 2rem;
          font-size: 1rem;
        }
        .ln-price-list {
          list-style: none;
          text-align: left;
          margin-bottom: 2.5rem;
        }
        .ln-price-list li {
          padding: 0.55rem 0;
          font-size: 0.95rem;
          color: var(--ink-light);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .ln-price-list li::before {
          content: '✓';
          color: var(--blue);
          font-weight: 700;
          flex-shrink: 0;
        }
        .ln-price-cta {
          display: block;
          width: 100%;
          background: var(--blue);
          color: white;
          padding: 0.9rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 600;
          text-align: center;
          transition: background 0.2s;
        }
        .ln-price-cta:hover { background: var(--blue-dark); }
        .ln-price-note {
          margin-top: 1rem;
          font-size: 0.82rem;
          color: var(--ink-muted);
        }

        /* HIPAA */
        .ln-hipaa {
          background: var(--warm);
          border-top: 1px solid var(--border);
          padding: 4rem 2rem;
        }
        .ln-hipaa-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .ln-hipaa-badge {
          display: inline-block;
          background: var(--white);
          border: 1px solid var(--border);
          padding: 0.4rem 1.2rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--blue);
          margin-bottom: 1.5rem;
        }
        .ln-hipaa h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .ln-hipaa p {
          font-size: 0.98rem;
          color: var(--ink-light);
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }

        /* BOTTOM CTA */
        .ln-bottom {
          padding: 6rem 2rem;
          text-align: center;
          max-width: 650px;
          margin: 0 auto;
        }
        .ln-bottom p {
          font-size: 1.1rem;
          color: var(--ink-light);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        /* FOOTER */
        .ln-footer {
          border-top: 1px solid var(--border);
          padding: 2rem;
          text-align: center;
          font-size: 0.82rem;
          color: var(--ink-muted);
        }
        .ln-footer a { color: var(--ink-muted); text-decoration: none; }
        .ln-footer a:hover { color: var(--blue); }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .ln-hero { padding: 7rem 1.5rem 4rem; }
          .ln-stat-row { grid-template-columns: 1fr; }
          .ln-steps { grid-template-columns: 1fr; gap: 2rem; }
          .ln-adv-grid { grid-template-columns: 1fr; }
          .ln-table { font-size: 0.85rem; }
          .ln-table th, .ln-table td { padding: 0.7rem 0.6rem; }
          .ln-price-card { padding: 2rem 1.5rem; }
          .ln-nav-link { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="ln-nav">
        <a href="/" className="ln-nav-logo">Well<span>QR</span></a>
        <div className="ln-nav-links">
          <a href="#how" className="ln-nav-link">How It Works</a>
          <a href="#pricing" className="ln-nav-link">Pricing</a>
          <a href="/app" className="ln-nav-link">Open App</a>
          <a href="#pricing" className="ln-nav-cta">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="ln-hero">
        <div className="ln-hero-tag">For dental &amp; medical practices</div>
        <h1>Your patients leave with good intentions.<br /><em>Put the appointment in their calendar.</em></h1>
        <p>WellQR is a dedicated checkout device that generates a scannable QR code for every appointment. One scan, and the visit is in their phone&rsquo;s calendar. No app. No portal. No forgotten appointment cards.</p>
        <a href="#pricing" className="ln-cta">Start your free trial</a>
      </section>

      {/* PROBLEM */}
      <section className="ln-problem">
        <div className="ln-problem-inner">
          <h2 className="ln-section-title">The no-show problem isn&rsquo;t a reminder problem</h2>
          <p className="ln-problem-text">Your patients aren&rsquo;t skipping appointments because they don&rsquo;t care. They&rsquo;re skipping because the appointment never made it into the one place they actually check &mdash; their phone&rsquo;s calendar. Reminder texts help, but they can&rsquo;t remind someone about something that was never recorded in the first place.</p>
          <div className="ln-stat-row">
            <div className="ln-stat-card">
              <div className="ln-stat-num">18–23%</div>
              <div className="ln-stat-label">Average no-show rate<br />in dental practices</div>
            </div>
            <div className="ln-stat-card">
              <div className="ln-stat-num">$150–300</div>
              <div className="ln-stat-label">Lost revenue per<br />missed appointment</div>
            </div>
            <div className="ln-stat-card">
              <div className="ln-stat-num">$9,000+</div>
              <div className="ln-stat-label">Monthly cost of no-shows<br />for a typical practice</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ln-how" id="how">
        <h2 className="ln-section-title">Three seconds at checkout</h2>
        <p className="ln-how-sub">No training. No workflow change. No IT department.</p>
        <div className="ln-steps">
          <div className="ln-step">
            <div className="ln-step-num">1</div>
            <h3>Enter the appointment</h3>
            <p>Staff types the date, time, and a brief title into the WellQR device at the front desk. Takes about ten seconds.</p>
          </div>
          <div className="ln-step">
            <div className="ln-step-num">2</div>
            <h3>Show the screen</h3>
            <p>A QR code appears instantly. Turn the device toward the patient or let them scan from the counter.</p>
          </div>
          <div className="ln-step">
            <div className="ln-step-num">3</div>
            <h3>It&rsquo;s in their calendar</h3>
            <p>The patient scans with their phone&rsquo;s camera. The appointment is added to their calendar with date, time, and location. Done.</p>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="ln-advantages">
        <div className="ln-advantages-inner">
          <h2 className="ln-section-title">Why this works when other tools don&rsquo;t</h2>
          <div className="ln-adv-grid">
            <div className="ln-adv-card">
              <span className="ln-adv-icon">⏱</span>
              <h3>Right moment, right action</h3>
              <p>The checkout desk is the only moment when the patient, the staff, and the next appointment are all in the same place. WellQR captures that moment before it&rsquo;s gone.</p>
            </div>
            <div className="ln-adv-card">
              <span className="ln-adv-icon">📱</span>
              <h3>No app for the patient</h3>
              <p>No download, no account, no patient portal. Every modern phone&rsquo;s camera can read a QR code and add a calendar event natively. Your patients already know how.</p>
            </div>
            <div className="ln-adv-card">
              <span className="ln-adv-icon">🔌</span>
              <h3>No integration for you</h3>
              <p>WellQR doesn&rsquo;t need to connect to your EHR, your PMS, or your network. Plug in the device, connect to WiFi, and you&rsquo;re live. There is nothing to configure and nothing to break.</p>
            </div>
            <div className="ln-adv-card">
              <span className="ln-adv-icon">🪑</span>
              <h3>Always on the counter</h3>
              <p>A dedicated device means no browser tabs to find, no app to open, no shared computer to negotiate. It&rsquo;s always there, always ready, always doing one thing.</p>
            </div>
            <div className="ln-adv-card">
              <span className="ln-adv-icon">🔄</span>
              <h3>Works with your existing tools</h3>
              <p>Already using Dentrix, Eaglesoft, Solutionreach, or any reminder system? WellQR complements all of them. Reminders work better when there&rsquo;s something in the calendar to remind about.</p>
            </div>
            <div className="ln-adv-card">
              <span className="ln-adv-icon">📋</span>
              <h3>Replaces the appointment card</h3>
              <p>The paper card in the wallet is a relic. Most patients lose it before they reach the car. A calendar entry with a notification the day before is what actually gets them back in the chair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="ln-compare">
        <h2 className="ln-section-title">Different from everything else</h2>
        <p className="ln-compare-sub">Patient engagement platforms are powerful, complex, and expensive. WellQR does one thing &mdash; and does it at the only moment that matters.</p>
        <table className="ln-table">
          <thead>
            <tr>
              <th></th>
              <th>Typical platforms</th>
              <th>WellQR</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>When it acts</td><td>Before the visit (reminders)</td><td>At checkout (calendar entry)</td></tr>
            <tr><td>Setup time</td><td>Weeks of IT integration</td><td>Under 5 minutes</td></tr>
            <tr><td>EHR integration</td><td>Required</td><td>Not needed</td></tr>
            <tr><td>Staff training</td><td>Significant</td><td>None</td></tr>
            <tr><td>Patient action required</td><td>App download or portal signup</td><td>Point camera, scan</td></tr>
            <tr><td>Monthly cost</td><td>$300–$800+ per provider</td><td>$49 per location</td></tr>
            <tr><td>Dedicated hardware</td><td className="ln-x">✗ Uses existing workstations</td><td className="ln-check">✓ Included</td></tr>
          </tbody>
        </table>
      </section>

      {/* MESSAGING */}
      <section className="ln-messaging">
        <div className="ln-messaging-inner">
          <h2 className="ln-section-title">Your screen. Your messages.</h2>
          <p>The patient-facing display doesn&rsquo;t just show a QR code. Configurable message zones surround it with rotating content from your practice &mdash; reminders, instructions, or anything you want your patients to see at the moment they&rsquo;re booking their next visit.</p>
          <p>Set your messages once. They rotate automatically with each new appointment.</p>
          <div className="ln-msg-tags">
            <span className="ln-msg-tag">Please arrive 15 minutes early</span>
            <span className="ln-msg-tag">Bring your insurance card</span>
            <span className="ln-msg-tag">Now accepting new patients</span>
            <span className="ln-msg-tag">Ask about our whitening specials</span>
            <span className="ln-msg-tag">Follow us @yourdentist</span>
            <span className="ln-msg-tag">Questions? Call (555) 123-4567</span>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="ln-pricing" id="pricing">
        <h2 className="ln-section-title">One plan. Everything included.</h2>
        <div className="ln-price-card">
          <div className="ln-price-amount">$49<span> /month</span></div>
          <div className="ln-price-desc">Per location. Device included.</div>
          <ul className="ln-price-list">
            <li>Dedicated touchscreen device, shipped to your door</li>
            <li>Unlimited QR code generations</li>
            <li>Configurable rotating message zones</li>
            <li>Works on any WiFi network</li>
            <li>Replacement device if anything breaks</li>
            <li>No contracts &mdash; cancel anytime</li>
            <li>No setup fee, no upfront hardware cost</li>
          </ul>
          <a href="mailto:hello@wellqr.com?subject=WellQR Trial Request" className="ln-price-cta">Start your free trial</a>
          <div className="ln-price-note">14-day free trial. No credit card required to start.</div>
        </div>
      </section>

      {/* HIPAA */}
      <section className="ln-hipaa">
        <div className="ln-hipaa-inner">
          <div className="ln-hipaa-badge">HIPAA COMPLIANT</div>
          <h3>Built for healthcare from day one</h3>
          <p>WellQR generates QR codes entirely on the device. No patient data is ever transmitted to external servers, stored in the cloud, or logged anywhere. Appointment details exist only in the device&rsquo;s memory for the few seconds it takes to create the QR code, then they&rsquo;re gone.</p>
          <p>The dedicated device runs a locked, single-purpose application &mdash; no browser, no email, no other apps. Physical access controls are the same ones your practice already uses for any checkout-area equipment.</p>
          <p>BAA available upon request.</p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="ln-bottom">
        <h2 className="ln-section-title">Every no-show costs your practice $200 or more. This costs $49 a month.</h2>
        <p>The math isn&rsquo;t complicated. If WellQR prevents even one missed appointment per month, it pays for itself. In practice, it will prevent far more than one.</p>
        <a href="mailto:hello@wellqr.com?subject=WellQR Trial Request" className="ln-cta">Request a device</a>
      </section>

      {/* FOOTER */}
      <footer className="ln-footer">
        <p>WellQR · Built by <a href="https://github.com/mjmasone">Michael Masone</a> · <a href="mailto:hello@wellqr.com">hello@wellqr.com</a></p>
      </footer>
    </>
  );
}
