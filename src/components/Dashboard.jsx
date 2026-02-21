import React, { useState } from 'react'
import CourseInput from './CourseInput'

export default function Dashboard({ onBack }) {
  const [courses, setCourses] = useState([])

  const addCourse = (c) => setCourses(prev => [c, ...prev])

  return (
    <div className="app-wrapper dashboard-bg">
      <main className="content-layer" style={{ alignItems: 'stretch' }}>
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

        <div className="dashboard-grid">
          <section className="box-input">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2">Course Input</h3>
              <CourseInput onAdd={addCourse} />
            </div>
          </section>

          <section className="box-preview">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2">Classes Preview</h3>
              {courses.length === 0 ? (
                <p>No courses yet</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {courses.map(c => (
                    <li key={c.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontWeight: 600 }}>{c.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>· {c.credits}cr</span></div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>{c.instructor || 'TBA'} — {c.days.join(', ')} {c.time.start}-{c.time.end}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="box-score">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
              <div className="score-value" style={{ fontSize: '2rem', fontWeight: '700' }}>—</div>
            </div>
          </section>

          <section className="box-grades">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2">Grade Distribution</h3>
              <p>Grade chart or stats placeholder.</p>
            </div>
          </section>
        </div>

        <div className="dashboard-back">
          <button className="btn-primary" onClick={onBack}>Back</button>
        </div>
      </main>
    </div>
  )
}
