import { useState } from 'react'
import fireLogo from './assets/fire-102.gif'
import './App.css'
import Dashboard from './components/Dashboard'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />
  }
  
  return (
    <div className="app-wrapper">
      {/* The Background GIF using the class we just made */}
      <img 
        src={fireLogo}
        className="background-gif" 
        alt="Fire background" 
      />

      {/* The Content Overlay */}
      <main className="content-layer">
        <h1 className="text-4xl font-bold mb-4">Project Name Here</h1>
        
        <div className="card-glass">
          <button 
            className="btn-primary"
            onClick={() => setShowDashboard(true)}
            > Start Stressing?
          </button>
          <p className="mt-4">Test text</p>
        </div>
      </main>
    </div>
  )
}

export default App