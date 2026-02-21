import React from 'react'

export default function LearnMore({ onBack }) {
  return (
    <div className="app-wrapper dashboard-bg">
      <main className="content-layer hero">
        <div className="hero-inner">
          <h1 className="hero-title">Burnout Bound — Learn More</h1>
          <p className="hero-sub">Visualize, optimize, and survive your schedule — before finals hit.</p>

          <div className="hero-ctas">
            <button className="btn-primary btn-cta" onClick={onBack}>Back</button>
          </div>
        </div>

        <div className="features" style={{ marginTop: '1.5rem' }}>
          <div className="feature">
            <strong>Fast input</strong>
            <span>Quickly add classes and see immediate impact.</span>
          </div>
          <div className="feature">
            <strong>Smart ratings</strong>
            <span>Data-driven schedule scoring.</span>
          </div>
          <div className="feature">
            <strong>Visual charts</strong>
            <span>Grade distribution and schedule summaries.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
