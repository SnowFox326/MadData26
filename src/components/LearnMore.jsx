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
            <span>Quickly add/remove your classes and get a simple schedule.</span>
          </div>
          <div className="feature">
            <strong>Smart ratings</strong>
            <span>Data-driven schedule scoring based on past grade distributions on a cumulative basis. The scores are calculated on a range of 0 - 100 with 0 being an easy A and 100 being very difficult.</span>
          </div>
          <div className="feature">
            <strong>Visual charts</strong>
            <span>Grade distribution per class and schedule summaries that are easy to understand.</span>
          </div>
          <div className="feature">
            <strong>Assignment heatmap</strong>
            <span>Visualize your workload across the semester and add custom assignments to see how they impact your schedule.</span>
          </div>
        </div>
      </main>
    </div>
  )
}
