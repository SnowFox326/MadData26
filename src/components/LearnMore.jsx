import React from 'react'

export default function LearnMore({ onBack }) {
  return (
    <div className="app-wrapper dashboard-bg">
      <main className="content-layer hero">
        <div className="hero-inner">
          <h1 className="hero-title">Burnout Bound</h1>
          <h1 className="hero-title">Learn More</h1>
          <p className="hero-sub">Visualize, optimize, and stress out before the semester ends.</p>

          <div className="hero-ctas">
            <button className="btn-primary btn-cta" onClick={onBack}>Back</button>
          </div>
        </div>

        <div className="features" style={{ marginTop: '1.5rem' }}>
          <div className="feature">
            <strong>Fast input</strong>
            <span>Quickly add your classes and get a simple schedule.</span>
          </div>
          <div className="feature">
            <strong>Smart ratings</strong>
            <span>Data-driven schedule scoring based on past grade distributions on a cumulative, per-semester, or per-instructor basis.</span>
          </div>
          <div className="feature">
            <strong>Visual charts</strong>
            <span>Grade distribution and schedule summaries that are easy to understand.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
