import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import LeadershipAndCompany from './components/LeadershipAndCompany'
import {
  Zap, Battery, Cpu, Shield, Milestone, RefreshCw,
  TrendingUp, ChevronDown, Award, Activity, CheckCircle2, XCircle
} from 'lucide-react'

// Lazy load the heavy 3D scene to keep initial bundles tiny and fast
const VoltronScene = lazy(() => import('./components/VoltronScene'))

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(end, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

// ─── Spec stat card ───────────────────────────────────────────────────────────
function StatCard({ value, unit, label, color = '#00e5ff', icon: Icon, animate }) {
  const num = parseInt(value) || 0
  const isNum = !isNaN(parseInt(value))
  const count = useCounter(num, 1600, animate)

  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon-wrap">
        <Icon size={22} color={color} />
      </div>
      <div className="stat-value">
        {isNum ? count : value}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// ─── Spec Row (tech breakdown panel) ─────────────────────────────────────────
function TechRow({ icon: Icon, title, desc, color = '#00e5ff' }) {
  return (
    <div className="tech-row">
      <div className="tech-row-icon" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div className="tech-row-title">{title}</div>
        <div className="tech-row-desc">{desc}</div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [statsVisible, setStatsVisible] = useState(false)
  const [heroInView, setHeroInView] = useState(true)
  
  const statsRef = useRef(null)
  const heroRef = useRef(null)

  // Trigger counters when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const [activeSection, setActiveSection] = useState('hero')

  // Dynamic observer to pause 3D Canvas rendering when the hero section leaves the viewport (avoids scroll lag)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setHeroInView(entry.isIntersecting) },
      { threshold: 0.02 } // Trigger unmount immediately when scrolled out of view
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Observer to track active section for nav highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3 }
    )
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(sec => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  // Global scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target) // Only animate once
        }
      })
    }, { threshold: 0.15 })
    
    // We add a tiny timeout so the DOM has time to render before querying
    setTimeout(() => {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el))
    }, 100)
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app-root">
      {/* ── Navigation ── */}
      <header>
        <a href="#" className="logo-container">
          <img src="/logo.jpg" alt="Praved EV Logo" className="logo-img" />
          <span>PRAVED EV</span>
        </a>
        <nav>
          <a href="#hero" className={activeSection === 'hero' ? 'active' : ''}>Voltron ACE</a>
          <a href="#technology" className={activeSection === 'technology' ? 'active' : ''}>Technology</a>
          <a href="#company" className={activeSection === 'company' ? 'active' : ''}>Company</a>
          <a href="#inquire" className={activeSection === 'inquire' ? 'active' : ''}>Invest</a>
        </nav>
        <a href="#inquire" className="cta-btn">Partner with Us</a>
      </header>

      {/* ══════════════════════════════════════════
          HERO — 3D model right, text left
      ══════════════════════════════════════════ */}
      <section id="hero" ref={heroRef} className="hero-section" style={{ background: '#070708' }}>
        {/* Atmospheric glow blobs */}
        <div className="glow-blob glow-cyan" />
        <div className="glow-blob glow-red" />

        {/* Left: brand text */}
        <div className="hero-left">
          <span className="hero-eyebrow">
            <span className="dot-pulse" />
            Working Prototype · Seeking Seed Round
          </span>
          <h1 className="hero-heading">
            Voltron ACE<br />
            <span className="hero-heading-accent">Redefined.</span>
          </h1>
          <p className="hero-body">
            India's first graphene-battery electric motorcycle. 300 km range.
            10-minute full charge on any 16A socket. Zero compromise engineering
            by Praved EV PVT. LTD., Udaipur.
          </p>
          <div className="hero-actions">
            <a href="#technology" className="cta-btn">Explore Technology</a>
            <a href="#inquire" className="cta-ghost-btn">
              Investment Deck <ChevronDown size={16} style={{ marginLeft: 6 }} />
            </a>
          </div>

          {/* Quick stats strip */}
          <div className="hero-quick-stats">
            <div className="quick-stat">
              <span className="qs-value">300<span className="qs-unit">km</span></span>
              <span className="qs-label">Range</span>
            </div>
            <div className="qs-divider" />
            <div className="quick-stat">
              <span className="qs-value">10<span className="qs-unit">min</span></span>
              <span className="qs-label">Full Charge</span>
            </div>
            <div className="qs-divider" />
            <div className="quick-stat">
              <span className="qs-value">16<span className="qs-unit">A</span></span>
              <span className="qs-label">Socket Only</span>
            </div>
          </div>
        </div>

        {/* Right: 3D canvas with dynamic unmount boundary to prevent GPU scroll lag */}
        <div className="hero-canvas-wrap">
          {heroInView ? (
            <Suspense fallback={
              <div className="canvas-local-loader">
                <div className="loader-spinner" />
                <div className="loader-title">PRAVED EV</div>
                <div className="loader-text">Initialising 3D Motorcycle Visualiser…</div>
              </div>
            }>
              <VoltronScene />
            </Suspense>
          ) : (
            <div className="canvas-static-placeholder" />
          )}
          {/* Seamless fade masks so canvas merges into page bg with no hard edge */}
          <div className="canvas-fade-top" />
          <div className="canvas-fade-bottom" />
          <div className="canvas-fade-sides" />
        </div>

        {/* Scroll nudge */}
        <a href="#technology" className="scroll-cue">
          <span>Scroll to explore</span>
          <ChevronDown size={18} color="var(--accent)" className="bounce-icon" />
        </a>
      </section>

      {/* ══════════════════════════════════════════
          ANIMATED STAT CARDS
      ══════════════════════════════════════════ */}
      <section className="stats-section" ref={statsRef} id="technology">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Performance Specification</span>
            <h2>Built Different. Built Better.</h2>
            <p>Every metric engineered to make EV ownership effortless for the Indian rider.</p>
          </div>
          <div className="stats-grid">
            <StatCard value="300" unit=" km" label="Riding Range" color="#00e5ff" icon={Milestone} animate={statsVisible} />
            <StatCard value="10" unit=" min" label="Full Charge" color="#ff1744" icon={Zap} animate={statsVisible} />
            <StatCard value="0" unit="" label="Thermal Runaway" color="#22ff88" icon={Shield} animate={statsVisible} />
            <StatCard value="AI" unit="" label="Per-Cell BMS" color="#a78bfa" icon={Cpu} animate={statsVisible} />
            <StatCard value="Regen" unit="" label="Braking Energy Recovery" color="#f59e0b" icon={RefreshCw} animate={statsVisible} />
            <StatCard value="16A" unit="" label="Standard Socket Charging" color="#00e5ff" icon={Battery} animate={statsVisible} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROPRIETARY INNOVATIONS
      ══════════════════════════════════════════ */}
      <section className="tech-section" id="technology">
        <div className="section-inner">
          <div className="section-header reveal-on-scroll">
            <span className="eyebrow">Core Architecture</span>
            <h2>Proprietary Innovations</h2>
            <p>
              Voltron ACE integrates a full vertical stack of custom engineering solutions — from 
              patented composite battery casings to localized BMS firmware.
            </p>
          </div>
          <div className="tech-grid">
            {[
              { icon: Battery, color: "#ff1744", title: "Graphene Battery Casing", desc: "Dual-layer structural composite casing enclosing next-gen graphene cells to achieve high heat dissipation and extreme safety." },
              { icon: Cpu, color: "#a78bfa", title: "AI-Powered BMS", desc: "Per-cell monitoring architecture with cloud diagnostics to dynamically balance voltages and predict health states." },
              { icon: Activity, color: "#f59e0b", title: "BLDC Hub Motor", desc: "Direct-drive hub motor engineered for heavy commuter cycles, outputting optimal torque curve with zero gear wear." },
              { icon: Shield, color: "#22ff88", title: "Custom Chassis & Suspension", desc: "USD telescopic front forks and mono-shock tuned dynamically to absorb typical tier-2/3 Indian road topography." },
              { icon: Zap, color: "#00e5ff", title: "16A Direct-Socket Charger", desc: "Eliminates heavy external adapter packs. Plugs directly into standard household wall sockets for seamless use." },
              { icon: RefreshCw, color: "#e879f9", title: "Kinetic Energy Recovery", desc: "Advanced regenerative braking system that captures deceleration kinetic energy to actively recharge the graphene battery." }
            ].map(({ icon: Icon, color, title, desc }, idx) => (
              <div className="tech-card reveal-on-scroll" key={title} style={{ '--card-neon': color, transitionDelay: `${idx * 0.1}s` }}>
                <div className="tech-card-icon" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={24} color={color} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPETITIVE SUPERIORITY Table
      ══════════════════════════════════════════ */}
      <section className="comparison-section">
        <div className="section-inner">
          <div className="section-header reveal-on-scroll">
            <span className="eyebrow">Benchmark Comparison</span>
            <h2>Outperforming the Industry</h2>
            <p>How our working prototype matches up against the current average electric motorcycle in India.</p>
          </div>
          <div className="table-wrap reveal-on-scroll">
            <table className="comparison-table-v2">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th className="highlight-col-v2">Voltron ACE</th>
                  <th>Typical Commercial EV</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Charging Speed (0-100%)', voltron: '10 Minutes', standard: '4 - 6 Hours' },
                  { metric: 'Riding Range (Tested)', voltron: '300 KM', standard: '100 - 140 KM' },
                  { metric: 'Charger Portability', voltron: 'Built-in (Standard 16A)', standard: 'Bulky External Unit' },
                  { metric: 'Cell Chemistry', voltron: 'Graphene Super-cells', standard: 'Standard Lithium-Ion' },
                  { metric: 'Thermal Cut-off Risk', voltron: 'Zero (Non-flammable Graphene)', standard: 'High (Requires cooling)' },
                  { metric: 'BMS Diagnostic Resolution', voltron: 'AI-monitored Per-Cell', standard: 'Pack-Level Only' },
                ].map(({ metric, voltron, standard }) => (
                  <tr key={metric}>
                    <td className="metric-label">{metric}</td>
                    <td className="metric-voltron">
                      <div className="metric-with-icon">
                        <CheckCircle2 size={16} color="var(--accent)" />
                        <span>{voltron}</span>
                      </div>
                    </td>
                    <td className="metric-standard">
                      <div className="metric-with-icon">
                        <XCircle size={16} color="var(--text-2)" />
                        <span>{standard}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROTOTYPE GALLERY + STORY
      ══════════════════════════════════════════ */}
      <section className="story-section" id="company">
        <div className="section-inner">
          <div className="section-header reveal-on-scroll">
            <span className="eyebrow">Working Prototype Validation</span>
            <h2>The Voltron ACE Story</h2>
            <p>
              Founded in Udaipur, Rajasthan by Chirag Sanadhya, Praved EV presents its first fully
              functional working prototype. We are seeking strategic investment partners to establish
              tooling, configure cell assembly lines, and transition to industrial manufacturing.
            </p>
          </div>

          <div className="story-merged-card reveal-on-scroll">
            <div className="story-merged-img">
              <img src="/studio_scooter.jpg" alt="Voltron ACE Prototype" className="story-img" />
              <div className="story-img-tag">Working Prototype</div>
            </div>
            
            <div className="story-merged-stats">
              <div className="ssc-header">
                <Zap size={22} color="var(--accent)" />
                <h3>Prototype Testing &amp; Validation</h3>
              </div>
              <div className="story-stats-list">
                {[
                  { label: "Odometer Tested", val: "12,500+ KM" },
                  { label: "Top Speed (Calibrated)", val: "85 KM/H" },
                  { label: "Power Efficiency", val: "98.4%" },
                  { label: "Temperature Tolerance", val: "-10°C to 55°C" },
                  { label: "Safety Framework Compliance", val: "AIS-156 Phase II" },
                  { label: "Chassis Fatigue Test", val: "Passed (10^6 Cycles)" }
                ].map(({ label, val }) => (
                  <div className="story-stat-row" key={label}>
                    <span className="ssr-label">{label}</span>
                    <span className="ssr-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INVESTMENT / FUNDING ROADMAP
      ══════════════════════════════════════════ */}
      <section className="funding-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Capital Scaling Path</span>
            <h2>Investment Roadmap</h2>
            <p>
              Praved EV has outlined a phased capital deployment plan to take the Voltron ACE from
              validated prototype to commercial production at scale.
            </p>
          </div>

          <div className="funding-phases">
            {[
              {
                phase: '01', amount: '₹5 Cr', label: 'Seed Round', color: '#00e5ff',
                goals: ['Prototype refinement & certifications', 'Component supply chain setup', 'Initial tooling & jigs', 'Core team expansion']
              },
              {
                phase: '02', amount: '₹20 Cr', label: 'Series A', color: '#ff1744',
                goals: ['Small-batch pilot production', 'Rajasthan dealer network launch', 'Enterprise fleet pilot contracts', 'BMS firmware V2 rollout']
              },
              {
                phase: '03', amount: '₹60 Cr', label: 'Series B', color: '#a78bfa',
                goals: ['Full-scale manufacturing line', 'Pan-India dealer expansion', 'Graphene cell assembly plant', 'Export market entry']
              },
            ].map(({ phase, amount, label, color, goals }) => (
              <div className="funding-card" key={phase} style={{ '--phase-color': color }}>
                <div className="phase-num">Phase {phase}</div>
                <div className="phase-amount" style={{ color }}>{amount}</div>
                <div className="phase-label">{label}</div>
                <ul className="phase-goals">
                  {goals.map(g => <li key={g}>{g}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SWOT
      ══════════════════════════════════════════ */}
      <section className="swot-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Strategic Analysis</span>
            <h2>SWOT Overview</h2>
          </div>
          <div className="swot-grid">
            {[
              { title: 'Strengths', color: '#22ff88', icon: Award, items: ['Proprietary 10-min graphene charging', '300 KM range on single charge', 'AI-powered per-cell BMS', 'Standard 16A socket — no charger needed'] },
              { title: 'Weaknesses', color: '#f59e0b', icon: Shield, items: ['Early-stage brand presence', 'Limited initial production capacity', 'Supply chain scaling dependency'] },
              { title: 'Opportunities', color: '#00e5ff', icon: TrendingUp, items: ['40–50% CAGR Indian EV market', 'Untapped Tier-2/3 commuter segment', 'Fleet electrification demand surge'] },
              { title: 'Threats', color: '#ff1744', icon: Activity, items: ['Legacy OEMs entering EV space', 'Battery material price volatility', 'Policy and subsidy shifts'] },
            ].map(({ title, color, icon: Icon, items }) => (
              <div className="swot-card" key={title} style={{ '--swot-color': color }}>
                <div className="swot-header">
                  <Icon size={18} color={color} />
                  <h3 style={{ color }}>{title}</h3>
                </div>
                <ul>
                  {items.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GTM ROADMAP
      ══════════════════════════════════════════ */}
      <section className="gtm-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Expansion Roadmap</span>
            <h2>Go-To-Market Strategy</h2>
            <p>A structured, multi-phase plan starting from Rajasthan and expanding nationally.</p>
          </div>
          <div className="gtm-steps">
            {[
              { num: '01', title: 'Dealer Network', desc: 'Flagship experience centres in key Tier-2 Rajasthan cities for test rides and localised sales.' },
              { num: '02', title: 'Enterprise Fleets', desc: 'Strategic bulk partnerships with logistics, parcel delivery, and commercial fleet operators.' },
              { num: '03', title: 'Customer Acquisition', desc: 'Digital awareness, hyper-local campaigns, and high-impact test-ride tours across corridors.' },
              { num: '04', title: 'Service Ecosystem', desc: 'Modular service nodes and annual maintenance contracts (AMC) to ensure retention.' },
            ].map(({ num, title, desc }) => (
              <div className="gtm-step" key={num}>
                <span className="gtm-num">{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LEADERSHIP
      ══════════════════════════════════════════ */}
      <LeadershipAndCompany />

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-brand">PRAVED EV PVT. LTD.</div>
        <div className="footer-copy">© {new Date().getFullYear()} Praved EV. All rights reserved.</div>
        <div className="footer-loc">Udaipur, Rajasthan, India</div>
      </footer>
    </div>
  )
}
