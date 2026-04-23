import { useState, useEffect } from 'react'
import MoodForm from './MoodForm'
import HistoryList from './HistoryList'

function App() {
  const [status, setStatus] = useState("Connecting to Insight Engine...")

  useEffect(() => {
    // Calling our Flask Backend on Port 5000
    fetch('http://127.0.0.1:5000/api/health')
      .then(res => res.json())
      .then(data => {
        // We use data.status and data.database because that's what Flask sends!
        setStatus(`Connected: ${data.status} | DB: ${data.database}`)
      })
      .catch(() => setStatus("Bridge Error: Is Flask running on Port 5000?"))
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f8f9fa' 
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#646cff' }}>Mental Health Insight App</h1>
        <hr style={{ border: '0.5px solid #eee', width: '80%' }} />
        <h2 style={{ color: '#2c3e50' }}>Engine Connection Status:</h2>
        <p style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: status.includes('Error') ? '#e74c3c' : '#27ae60' 
        }}>
          {status}
        </p>
        <MoodForm />
        <HistoryList />
      </div>
    </div>
  )
}

export default App