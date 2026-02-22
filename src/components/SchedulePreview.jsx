import React from 'react'

const DAYS = [
  { key: 'M', label: 'Mon' },
  { key: 'T', label: 'Tue' },
  { key: 'W', label: 'Wed' },
  { key: 'Th', label: 'Thu' },
  { key: 'F', label: 'Fri' },
]

function toMinutes(t) {
  // time expected as "HH:MM"
  const [hh, mm] = String(t).split(':').map(Number)
  return hh * 60 + (mm || 0)
}

export default function SchedulePreview({ courses = [], startHour = 7, endHour = 22 }) {
  const dayMinutes = (endHour - startHour) * 60

  const blocksForDay = (dayKey) => {
    return courses
      .filter(c => c.days && c.days.includes(dayKey))
      .map(c => {
        const s = toMinutes(c.time.start)
        const e = toMinutes(c.time.end)
        const topPct = ((s - startHour * 60) / dayMinutes) * 100
        const heightPct = ((e - s) / dayMinutes) * 100
        return { ...c, topPct, heightPct }
      })
  }

  const hours = []
  for (let h = startHour; h <= endHour; h++) hours.push(h)

  return (
    <div className="schedule-wrapper">
      <div className="schedule-hours">
        {hours.map(h => (
          <div key={h} className="hour">{h}:00</div>
        ))}
      </div>

      <div className="schedule-grid">
        {DAYS.map(day => (
          <div key={day.key} className="day-column">
            <div className="day-label">{day.label}</div>
            <div className="day-body">
              {blocksForDay(day.key).map(b => (
                <div
                  key={b.id}
                  className="course-block"
                  title={`${b.name} — ${b.instructor || 'TBA'}`}
                  style={{
                    top: `${b.topPct}%`,
                    height: `${Math.max(b.heightPct, 1)}%`
                  }}
                >
                  <div className="block-title">{b.name}</div>
                  <div className="block-meta">{b.time.start}–{b.time.end} • {b.credits}cr</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
