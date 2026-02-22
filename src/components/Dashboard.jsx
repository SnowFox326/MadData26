import React, { useState } from 'react'
import CourseInput from './CourseInput'
import SchedulePreview from './SchedulePreview'

export default function Dashboard({ onBack }) {
  const [courses, setCourses] = useState([])

  const addCourse = (c) => setCourses(prev => [c, ...prev])
  const removeCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id))
  const [overallScore, setOverallScore] = useState(null)
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreError, setScoreError] = useState(null)

  const getScoreClass = (score) => {
    if (score === null || score === undefined) return ''
    const s = Number(score)
    if (Number.isNaN(s)) return ''
    if (s >= 81) return 'score-high'
    if (s >= 61) return 'score-mid-high'
    if (s >= 41) return 'score-mid'
    if (s >= 21) return 'score-low-mid'
    return 'score-low'
  }

  const isHighScore = getScoreClass(overallScore) === 'score-high'

  const recalcScore = async () => {
    if (courses.length === 0) {
      setOverallScore(null)
      return
    }
    const codes = courses.map(c => c.name)
    const credits = courses.map(c => c.credits)
    setScoreLoading(true)
    setScoreError(null)
    try {
      const res = await fetch('http://localhost:5000/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codes, credits })
      })
      const data = await res.json()
      if (!res.ok) {
        setScoreError(data.error || 'Server error')
        setOverallScore(null)
      } else {
        setOverallScore(data.score)
        // also fetch graphs
        try {
          const gRes = await fetch('http://localhost:5000/graphs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codes })
          })
          const gData = await gRes.json()
          if (gRes.ok && gData.graphs) {
            setGraphs(gData.graphs)
            setSelectedGraphIndex(gData.graphs.length ? 0 : null)
          } else {
            setGraphs([])
          }
        } catch (err) {
          setGraphs([])
        }
      }
    } catch (err) {
      setScoreError(String(err))
      setOverallScore(null)
    } finally {
      setScoreLoading(false)
    }
  }
  const [graphs, setGraphs] = useState([])
  const [selectedGraphIndex, setSelectedGraphIndex] = useState(null)

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
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <SchedulePreview courses={courses} />
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {courses.map(c => (
                      <li key={c.id} className="course-list-item" style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>· {c.credits}cr</span></div>
                          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>{c.instructor || 'TBA'} — {c.days.join(', ')} {c.time.start}-{c.time.end}</div>
                        </div>
                        <div>
                          <button className="btn-remove" onClick={() => removeCourse(c.id)} aria-label={`Remove ${c.name}`}>
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>

          <section className="box-score">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2" style = {{ fontSize: '3rem'}}>Overall Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div className={`score-value ${getScoreClass(overallScore)} ${isHighScore ? 'score-fire-fill' : ''}`} style={{ fontSize: '2.25rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center' }}>
                  {scoreLoading ? '...' : (overallScore !== null ? overallScore : '—')}
                </div>
                <div>
                  <button className="btn-primary" onClick={recalcScore} disabled={scoreLoading || courses.length===0}>
                    Recalculate
                  </button>
                </div>
              </div>
              {scoreError && <div style={{ color: 'salmon', marginTop: '0.5rem' }}>{scoreError}</div>}
            </div>
          </section>

          <section className="box-grades">
            <div className="card-glass">
              <h3 className="text-xl font-semibold mb-2">Grade Distribution</h3>
              {graphs.length === 0 ? (
                <p>No graphs. Click Recalculate to load grade charts.</p>
              ) : (
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <img src={graphs[selectedGraphIndex]?.image} alt={graphs[selectedGraphIndex]?.code} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {graphs.map((g, i) => (
                      <button key={g.code} className="btn-secondary" onClick={() => setSelectedGraphIndex(i)}>{g.code}</button>
                    ))}
                  </div>
                </div>
              )}
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
