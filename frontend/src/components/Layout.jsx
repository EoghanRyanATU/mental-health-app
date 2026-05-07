export const Navbar = () => (
  <nav style={{ 
    backgroundColor: '#fff', 
    padding: '0.75rem 10%', 
    borderBottom: '1px solid #e2e8f0', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '1.5rem' }}>🧠</span>
      <h2 style={{ margin: 0, color: '#6366f1', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>MindState</h2>
    </div>

    {/* Placeholder Nav Links */}
    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
      <a href="#" style={{ textDecoration: 'none', color: '#6366f1', fontWeight: '600', fontSize: '0.9rem' }}>Home</a>
      <a href="#" style={{ textDecoration: 'none', color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>My Diary</a>
      <button style={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', padding: '6px 15px', borderRadius: '6px', fontSize: '0.85rem' }}>Login</button>
      <button style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '6px', fontSize: '0.85rem' }}>Logout</button>
    </div>
  </nav>
);

export const Footer = () => (
  <footer style={{ marginTop: 'auto', padding: '3rem 10%', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
    <p>© 2026 MindState Analytics • All Systems Operational</p>
  </footer>
);