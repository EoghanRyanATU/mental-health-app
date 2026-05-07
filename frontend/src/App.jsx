import { useState, useEffect } from 'react'
import { Navbar, Footer } from './components/Layout'
import MoodForm from './MoodForm'
import HistoryList from './HistoryList'
import TrendsChart from './TrendsChart'

function App() {
  const [status, setStatus] = useState("Connecting to Insight Engine...")

  // Backend Health Check
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/health')
      .then(res => res.json())
      .then(data => {
        setStatus(`Connected: ${data.status} | DB: ${data.database}`)
      })
      .catch(() => setStatus("Bridge Error: Is Flask running on Port 5000?"))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. NAVIGATION BAR */}
      <Navbar />

      {/* 2. SUBTLE CONNECTION STATUS BANNER */}
      <div style={{ 
        backgroundColor: status.includes('Error') ? '#fef2f2' : '#f0fdf4',
        padding: '8px 0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: status.includes('Error') ? '#991b1b' : '#166534',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <span style={{ 
          display: 'inline-block', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: status.includes('Error') ? '#ef4444' : '#22c55e',
          marginRight: '8px'
        }}></span>
        {status}
      </div>

      {/* 3. MAIN CONTENT COLUMN */}
      <main style={{ 
        flex: 1, 
        maxWidth: '850px', 
        margin: '40px auto', 
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px' // Space between cards
      }}>
        
        {/* HERO SECTION */}
        <header style={{ textAlign: 'left' }}>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: '800', 
            color: '#1e293b', 
            margin: '0 0 10px 0',
            letterSpacing: '-1px'
          }}>
            Daily Check-in
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
            Track your mood and activity to generate rule-based insights.
          </p>
        </header>

        {/* INPUT CARD (MoodForm) */}
        <section style={{ 
          backgroundColor: 'white', 
          padding: '35px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          border: '1px solid #f1f5f9'
        }}>
          <MoodForm />
        </section>

        {/* ANALYTICS CARD (TrendsChart) */}
        <section style={{ 
          backgroundColor: 'white', 
          padding: '35px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
             <span style={{ fontSize: '1.2rem' }}>📈</span>
             <h3 style={{ margin: 0, color: '#1e293b' }}>Mood Trends</h3>
          </div>
          <TrendsChart />
        </section>

        {/* LOGS SECTION (HistoryList) */}
        <section>
           <HistoryList />
        </section>
        
      </main>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  )
}

export default App