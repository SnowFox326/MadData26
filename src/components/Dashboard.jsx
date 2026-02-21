import React from 'react'

export default function Dashboard({ onBack }) {
  return (
    <div className="app-wrapper">
      <img
        src="/src/assets/fire-102.gif"
        className="background-gif"
        alt="Fire background"
      />

      <main className="content-layer">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
        <div className="card-glass">
          <p>All relevant information will be displayed here.</p>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn-primary" onClick={onBack}>Back</button>
          </div>
        </div>
      </main>
    </div>
  )
}
