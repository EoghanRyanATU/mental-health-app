import { Link } from 'react-router-dom';

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => (
  <nav style={{ 
    backgroundColor: '#0f172a', // Solid Deep Navy
    padding: '1rem 10%', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' // Stronger shadow for the solid look
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '1.5rem' }}>🧠</span>
      <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Insight</h2>
    </div>

    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
      {/* These Links match the routes we will create in App.jsx */}
      <Link to="/" style={navLinkStyle}>Dashboard</Link>
      <Link to="/journal" style={navLinkStyle}>Journal</Link>
      <Link to="/analytics" style={navLinkStyle}>Analytics</Link>
      <Link to="/resources" style={navLinkStyle}>Resources</Link>
      
      <button 
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        style={{ 
          backgroundColor: '#6366f1', 
          color: '#fff', 
          border: 'none', 
          padding: '8px 20px', 
          borderRadius: '8px', 
          fontSize: '0.85rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  </nav>
);

const navLinkStyle = { 
  textDecoration: 'none', 
  color: '#cbd5e1', // Light grey text for the dark background
  fontWeight: '500', 
  fontSize: '0.9rem',
  transition: 'color 0.2s'
};

export const Footer = () => (
  <footer style={{ 
    backgroundColor: '#0f172a', 
    padding: '3rem 10%', 
    textAlign: 'center', 
    color: '#94a3b8', 
    fontSize: '0.8rem',
    marginTop: 'auto' 
  }}>
    <p style={{ color: '#f8fafc', marginBottom: '10px' }}>© 2026 MindState Analytics</p>
    <p>Section 3.3.4: Data Retrieval and Serialization Protocol</p>
  </footer>
);