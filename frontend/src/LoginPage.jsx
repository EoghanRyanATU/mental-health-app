import React, { useState } from 'react';

function LoginPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegistering ? '/api/auth/signup' : '/api/auth/login';

    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          alert("Account created successfully! Please log in.");
          setIsRegistering(false);
          setFormData({ username: '', password: '' });
        } else {
          // data contains { user_id, username } from your app.py
          onLoginSuccess(data); 
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Server is unreachable. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontSize: '2.5rem' }}>🧠</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginTop: '10px' }}>
            Insight!
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {isRegistering ? 'Create your private health vault' : 'Welcome back to your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            style={inputStyle}
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ background: 'none', border: 'none', color: '#6366f1', marginTop: '25px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

// --- STYLING ---
const containerStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '50px 40px',
  borderRadius: '32px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
  border: '1px solid #f1f5f9'
};

const inputStyle = {
  padding: '14px 18px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#fcfdfe'
};

const buttonStyle = {
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: '#6366f1',
  color: 'white',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
};

export default LoginPage;