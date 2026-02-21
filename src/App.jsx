import { useState } from 'react'
import fireLogo from './assets/fire-102.gif'
import './App.css'
import Dashboard from './components/Dashboard'
import LearnMore from './components/LearnMore'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [showLearn, setShowLearn] = useState(false)

  // Handlers that close pages and scroll the landing to top
  const closeDashboard = () => {
    setShowDashboard(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeLearn = () => {
    setShowLearn(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showDashboard) {
    return <Dashboard onBack={closeDashboard} />
  }

  if (showLearn) {
    return <LearnMore onBack={closeLearn} />
  }

  return (
    <div className="app-wrapper">
      <img src={fireLogo} className="background-gif" alt="Animated background" />

      <main className="content-layer hero">
        <div className="hero-inner">
          <h1 className="hero-title">Burnout Bound</h1>
          <p className="hero-sub">Visualize, optimize, and survive your schedule — before finals hit.</p>

          <div className="hero-ctas">
            <button
              className="btn-primary btn-cta"
              onClick={() => setShowDashboard(true)}
              aria-label="Open dashboard"
            >
              Start Stressing
            </button>
            <button className="btn-secondary" onClick={() => setShowLearn(true)}>Learn more</button>
          </div>
        </div>
        
      </main>
    </div>
  )
}

export default App