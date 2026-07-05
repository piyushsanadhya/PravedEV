import React, { useState } from 'react'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function LeadershipAndCompany() {
  const [formData, setFormData] = useState({ name: '', email: '', city: '', options: 'invest' })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#00e5ff', '#00b4d8', '#ff1744', '#ffffff']
    })
  }

  return (
    <>
      {/* LEADERSHIP TEAM */}
      <section style={{ padding: '100px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Founding Team</span>
            <h2>The Leadership</h2>
            <p>Deep technical expertise in electric powertrains combined with decades of market development experience.</p>
          </div>
          <div className="leadership-container">
            <div className="profile-card">
              <div className="profile-header">
                <img src="/chirag.jpeg" alt="Chirag Sanadhya" className="profile-img" />
                <div className="profile-titles">
                  <h3>Chirag Sanadhya</h3>
                  <span className="role">Founder &amp; CEO</span>
                </div>
              </div>
              <p className="bio">
                B.Tech in Electronics &amp; Electrical Engineering with 7+ years in automotive and EV systems.
                Specialised in BMS architecture, battery integration, and product innovation. Leads technology
                development and strategic vision at Praved EV.
              </p>
            </div>

            <div className="profile-card">
              <div className="profile-header">
                <img src="/director.png" alt="Mahesh Sanadhya" className="profile-img" />
                <div className="profile-titles">
                  <h3>Mahesh Sanadhya</h3>
                  <span className="role">Director</span>
                </div>
              </div>
              <p className="bio">
                B.Tech in Civil Engineering with 23+ years in business growth, enterprise sales, dealer
                network setup, and channel partner management. Drives dealership expansion, fleet
                operations, and market growth frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INVESTMENT INQUIRY FORM */}
      <section id="inquire" style={{ padding: '100px 0' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Capital &amp; Expansion</span>
            <h2>Partner in the Future of EV</h2>
            <p>
              Praved EV is in prototype validation and seeking strategic investors and partners to
              scale the Voltron ACE to commercial production.
            </p>
          </div>
          <div className="booking-container">
            <div className="booking-info">
              <span className="hero-tag">Why Invest Now</span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '14px' }}>Early-Stage Opportunity</h2>
              <p>
                The Indian EV two-wheeler market is projected to grow at 40–50% CAGR. Praved EV's
                proprietary graphene-based battery and AI BMS technology gives it an unfair technical
                advantage over all existing competitors. Now is the moment to get in at ground level.
              </p>

              <div className="contact-details" style={{ marginTop: '28px' }}>
                <a href="mailto:info@pravedev.com" className="contact-item">
                  <Mail size={18} color="var(--accent)" />
                  <span>info@pravedev.com</span>
                </a>
                <a href="tel:+918302111113" className="contact-item">
                  <Phone size={18} color="var(--accent)" />
                  <span>+91 83021 11113 &nbsp;/&nbsp; +91 77372 62626</span>
                </a>
                <div className="contact-item">
                  <MapPin size={18} color="var(--accent)" />
                  <span>269, B-Block, Meera Nagar, Bhuwana, Udaipur — 313001</span>
                </div>
              </div>
            </div>

            <div className="booking-form">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name / Organisation</label>
                    <input type="text" id="name" name="name" required value={formData.name}
                      onChange={handleInputChange} placeholder="Your name or firm" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" required value={formData.email}
                      onChange={handleInputChange} placeholder="you@firm.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Headquarters / City</label>
                    <input type="text" id="city" name="city" required value={formData.city}
                      onChange={handleInputChange} placeholder="e.g. Mumbai, Bengaluru" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="options">Inquiry Type</label>
                    <select id="options" name="options" value={formData.options} onChange={handleInputChange}>
                      <option value="invest">Strategic Investor (VC / Angel)</option>
                      <option value="fleet">Commercial Fleet Pilot Partner</option>
                      <option value="distributor">Franchise Dealer / Distributor</option>
                    </select>
                  </div>
                  <button type="submit" className="form-submit-btn">
                    Request Pitch Deck &amp; Financials
                  </button>
                </form>
              ) : (
                <div className="form-success-msg">
                  <h3>Inquiry Registered!</h3>
                  <p style={{ color: 'var(--text-2)', marginBottom: '10px' }}>
                    Thank you, <strong>{formData.name}</strong>. Your interest as a{' '}
                    <strong>
                      {formData.options === 'invest' ? 'Strategic Investor'
                        : formData.options === 'fleet' ? 'Fleet Pilot Partner'
                        : 'Franchise Partner'}
                    </strong> has been recorded.
                  </p>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.88rem' }}>
                    Chirag Sanadhya will personally deliver the confidential pitch deck to{' '}
                    <strong>{formData.email}</strong> within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
