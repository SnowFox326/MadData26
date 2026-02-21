import React, { useState } from 'react'

export default function CourseInput({ onAdd }) {
  const [name, setName] = useState('')
  const [instructor, setInstructor] = useState('')
  const [credits, setCredits] = useState(3)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [days, setDays] = useState({ M: false, T: false, W: false, Th: false, F: false })
  const [semester, setSemester] = useState('Fall')

  const toggleDay = (d) => setDays(prev => ({ ...prev, [d]: !prev[d] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedDays = Object.keys(days).filter(d => days[d])
    if (!name.trim()) return
    const course = {
      id: Date.now(),
      name: name.trim(),
      instructor: instructor.trim(),
      credits: Number(credits) || 0,
      time: { start: startTime, end: endTime },
      days: selectedDays,
      semester,
    }
    if (onAdd) onAdd(course)
    // reset
    setName('')
    setInstructor('')
    setCredits(3)
    setStartTime('09:00')
    setEndTime('10:00')
    setDays({ M: false, T: false, W: false, Th: false, F: false })
  }

  return (
    <form className="course-input" onSubmit={handleSubmit}>
      <label>
        Course name
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CS 201" required />
      </label>

      <label>
        Instructor
        <input type="text" value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="Instructor name" />
      </label>

      <label>
        Credits
        <input type="number" min="0" max="6" value={credits} onChange={e => setCredits(e.target.value)} />
      </label>

      <div className="time-row">
        <label>
          Start
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </label>
        <label>
          End
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </label>
      </div>

      <div className="days-row">
        {['M','T','W','Th','F'].map(d => (
          <label key={d} className="day">
            <input type="checkbox" checked={days[d]} onChange={() => toggleDay(d)} /> {d}
          </label>
        ))}
      </div>

      <label>
        Semester (optional)
        <select value={semester} onChange={e => setSemester(e.target.value)}>
            <option>Fall 2025</option>
            <option>Spring 2025</option>
            <option>Fall 2024</option>
            <option>Spring 2024</option>
            <option>Fall 2023</option>
            <option>Spring 2023</option>
            <option>Fall 2022</option>
            <option>Spring 2022</option>
            <option>Fall 2021</option>
            <option>Spring 2021</option>
            <option>Fall 2020</option>
            <option>Spring 2020</option>    
            <option>Fall 2019</option>
            <option>Spring 2019</option>
            <option>Fall 2018</option>
            <option>Spring 2018</option>
            <option>Fall 2017</option>
        </select>
      </label>

      <div style={{ marginTop: '0.75rem' }}>
        <button type="submit" className="btn-primary">Add Course</button>
      </div>
    </form>
  )
}
