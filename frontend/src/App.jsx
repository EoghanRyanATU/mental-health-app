import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar, Footer } from './components/Layout'
import MoodForm from './MoodForm'
import HistoryList from './HistoryList'
import TrendsChart from './TrendsChart'
import Resources from './pages/Resources';

// Temporary Placeholder components for new pages
const AnalyticsPage = () => (
  <div style={cardStyle}>
    <h2>Advanced Analytics</h2>
    <p style={{ color: '#64748b' }}>Detailed sleep vs. mood correlations coming soon.</p>
  </div>
);

const ResourcesPage = () => (
  <div style={cardStyle}>
    <h2>Support Resources</h2>
    <p style={{ color: '#64748b' }}>Helpful links and breathing exercises will be listed here.</p>
  </div>
);

function App() {
  const [status, setStatus] = useState("Connecting to Insight Engine...")
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for Auth state

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
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* 1. NAVIGATION BAR */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {/* 2. CONNECTION STATUS BANNER - Visible on all pages */}
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

        {/* 3. DYNAMIC CONTENT AREA */}
        <main style={{ 
          flex: 1, 
          maxWidth: '850px', 
          margin: '40px auto', 
          width: '90%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          <Routes>
            {/* DASHBOARD ROUTE (HOME) */}
            <Route path="/" element={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <header style={{ textAlign: 'left' }}>
                  <h1 style={headerStyle}>Dashboard</h1>
                  <p style={subHeaderStyle}>Check in with your mind and see your recent trends.</p>
                </header>

                <section style={cardStyle}>
                  <MoodForm />
                </section>

                <section style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                    <span style={{ fontSize: '1.2rem' }}>📈</span>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Weekly Overview</h3>
                  </div>
                  <TrendsChart />
                </section>
              </div>
            } />

            {/* JOURNAL ROUTE */}
            <Route path="/journal" element={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <header style={{ textAlign: 'left' }}>
                  <h1 style={headerStyle}>My Journal</h1>
                  <p style={subHeaderStyle}>Review all your past entries and insights.</p>
                </header>
                <HistoryList />
              </div>
            } />

            {/* ANALYTICS ROUTE */}
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* RESOURCES ROUTE */}
            <Route path="/resources" element={<Resources />} />
          </Routes>
          
        </main>

        <Footer />
      </div>
    </Router>
  )
}

// Styling Constants to keep the JSX clean
const cardStyle = {
  backgroundColor: 'white',
  padding: '35px',
  borderRadius: '24px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
  border: '1px solid #f1f5f9'
};

const headerStyle = {
  fontSize: '2.4rem', 
  fontWeight: '800', 
  color: '#1e293b', 
  margin: '0 0 10px 0',
  letterSpacing: '-1px'
};

const subHeaderStyle = {
  color: '#64748b', 
  fontSize: '1.1rem', 
  margin: 0
};

export default App;