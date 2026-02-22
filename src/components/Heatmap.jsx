import React, { useMemo, useState } from 'react'

const defaultTypes = [
  { id: 'homework', name: 'Homework', weight: 1 },
  { id: 'quiz', name: 'Quiz', weight: 2 },
  { id: 'exam', name: 'Exam', weight: 4 },
  { id: 'project', name: 'Project', weight: 3 },
  { id: 'paper', name: 'Paper', weight: 3 },
  { id: 'other', name: 'Other', weight: 1 },
]

const formatDateISO = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getColorForRatio(r) {
  // r in [0,1] -> interpolate from pale yellow to orange/red
  const start = [255, 247, 205] // pale
  const mid = [255, 183, 77]
  const end = [255, 61, 0]
  const p = Math.min(1, Math.max(0, r))
  const a = p < 0.5 ? p * 2 : 1
  const mix = p < 0.5 ? mid : end
  const t = p < 0.5 ? p * 2 : (p - 0.5) * 2
  const rVal = Math.round(start[0] + (mix[0] - start[0]) * (p < 0.5 ? t : 1))
  const gVal = Math.round(start[1] + (mix[1] - start[1]) * (p < 0.5 ? t : 1))
  const bVal = Math.round(start[2] + (mix[2] - start[2]) * (p < 0.5 ? t : 1))
  return `rgb(${rVal}, ${gVal}, ${bVal})`
}

export default function Heatmap() {
  const year = new Date().getFullYear()
  const [types] = useState(defaultTypes)
  const [assignments, setAssignments] = useState([])
  const [selType, setSelType] = useState(types[0].id)
  const [date, setDate] = useState(formatDateISO(new Date()))
  const [weight, setWeight] = useState(types[0].weight)

  const onTypeChange = (e) => {
    const id = e.target.value
    setSelType(id)
    const t = types.find(x => x.id === id)
    if (t) setWeight(t.weight)
  }

  const addAssignment = () => {
    if (!date) return
    const id = `${selType}-${date}-${Date.now()}`
    setAssignments(prev => [{ id, type: selType, date, weight: Number(weight) }, ...prev])
  }

  const removeAssignment = (id) => setAssignments(prev => prev.filter(a => a.id !== id))

  const start = useMemo(() => {
    const d = new Date(year, 0, 1)
    const day = d.getDay() // 0..6
    d.setDate(d.getDate() - day)
    return d
  }, [year])

  const weeks = useMemo(() => {
    const cols = []
    const curr = new Date(start)
    for (let w = 0; w < 53; w++) {
      const days = []
      for (let dow = 0; dow < 7; dow++) {
        days.push(new Date(curr))
        curr.setDate(curr.getDate() + 1)
      }
      cols.push(days)
    }
    return cols
  }, [start])

  const weightByDate = useMemo(() => {
    const map = new Map()
    for (const a of assignments) {
      const d = a.date
      map.set(d, (map.get(d) || 0) + Number(a.weight || 0))
    }
    return map
  }, [assignments])

  const maxWeight = useMemo(() => {
    let m = 0
    for (const v of weightByDate.values()) m = Math.max(m, v)
    return m || 1
  }, [weightByDate])

  return (
    <div className="heat-container">
      <div className="heat-controls">
        <label>
          Assignment Type
          <select value={selType} onChange={onTypeChange}>
            {types.map(t => <option key={t.id} value={t.id}>{t.name} (w={t.weight})</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Weight
          <input type="number" min="0" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
        </label>
        <button className="btn-primary" onClick={addAssignment}>Add</button>
      </div>

      <div className="heat-legend">Legend: <span className="legend-box" style={{ background: getColorForRatio(0.2) }} /> low <span className="legend-box" style={{ background: getColorForRatio(0.5) }} /> mid <span className="legend-box" style={{ background: getColorForRatio(0.95) }} /> high</div>

      <div className="calendar-heatmap" role="img" aria-label={`Heatmap for ${year}`}>
        {weeks.map((week, wi) => (
          <div className="week-col" key={wi}>
            {week.map((d, di) => {
              const key = formatDateISO(d)
              const v = weightByDate.get(key) || 0
              const ratio = v / maxWeight
              const isInYear = d.getFullYear() === year
              return (
                <div
                  key={di}
                  title={`${key}${v ? ` — weight ${v}` : ''}`}
                  className={`day-cell ${isInYear ? '' : 'muted-day'}`}
                  style={{ background: isInYear && v ? getColorForRatio(ratio) : 'transparent' }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="assign-list">
        {assignments.length === 0 ? <div className="muted">No assignments</div> : (
          <ul>
            {assignments.map(a => (
              <li key={a.id}>{a.date} — {a.type} (w={a.weight}) <button className="btn-remove" onClick={() => removeAssignment(a.id)}>Remove</button></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
