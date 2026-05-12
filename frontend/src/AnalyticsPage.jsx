import React, { useState, useEffect } from 'react';
import TrendsChart from './TrendsChart';

// 1. Added { user } prop to accept the session from App.jsx
function AnalyticsPage({ user }) {
  const [correlations, setCorrelations] = useState({});
  const [advanced, setAdvanced] = useState(null);
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);

  useEffect(() => {
    // Guard clause: Ensure we have a user before fetching
    if (!user || !user.user_id) return;

    // 2. Updated all fetches to include the user_id query parameter
    
    // Fetch Sleep Correlation
    fetch(`http://127.0.0.1:5000/api/stats/sleep-correlation?user_id=${user.user_id}`)
      .then(res => res.ok ? res.json() : {})
      .then(data => setCorrelations(data))
      .catch(err => console.error("Sleep API Error:", err));

    // Fetch Advanced Stats
    fetch(`http://127.0.0.1:5000/api/stats/advanced?user_id=${user.user_id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setAdvanced(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Advanced API Error:", err);
        setLoading(false);
      });

    // Fetch Word Cloud Data
    fetch(`http://127.0.0.1:5000/api/stats/word-cloud?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => setWords(data))
      .catch(err => console.error("Word Cloud API Error:", err));

    // 3. Dependency array: Re-run if the user changes
  }, [user]);

  // --- STYLES (Untouched) ---
  const cardStyle = { padding: '40px', backgroundColor: '#fff', borderRadius: '28px', border: '1px solid #f1f5f9', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', textAlign: 'left' };
  const statBoxStyle = { padding: '25px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' };
  const insightBoxStyle = { padding: '25px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flex: 1, minWidth: '200px' };
  const labelStyle = { fontSize: '0.75rem', color: '#6366f1', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '800', letterSpacing: '0.1em' };
  const tipBannerStyle = { marginTop: '30px', padding: '20px', backgroundColor: '#f5f3ff', borderRadius: '16px', color: '#5b21b6', fontSize: '0.95rem', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', gap: '15px' };

  if (loading) return <div style={{padding: '100px', textAlign: 'center', color: '#64748b'}}>Calculating deep insights for {user.username}...</div>;

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '30px', letterSpacing: '-1.5px', textAlign: 'left' }}>
        Advanced Analytics
      </h1>

      {/* SECTION 1: MOOD PROGRESSION */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '30px' }}>
          <h4 style={labelStyle}>Mood Progression Trends</h4>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Visualizing emotional variance over your last 7 check-ins.</p>
        </div>
        <div style={{ width: '100%', minHeight: '250px', position: 'relative' }}>
          {/* 4. Pass user to the TrendsChart for isolation */}
          <TrendsChart user={user} />
        </div>
      </div>

      {/* SECTION 2: BEHAVIORAL INSIGHTS */}
      <div style={cardStyle}>
        <h4 style={labelStyle}>Behavioral Impact</h4>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '25px' }}>Identifying correlations between habits and mental wellness.</p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={insightBoxStyle}>
            <span style={{ fontSize: '1.8rem' }}>🏃‍♂️</span>
            <div style={{ marginTop: '10px' }}>
              <strong style={{ display: 'block', fontSize: '1.6rem', color: '#1e293b' }}>
                {advanced?.exercise_impact?.find(d => d.exercise === 1)?.happy_count || 0} Happy Days
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Linked to Physical Activity</span>
            </div>
          </div>

          <div style={insightBoxStyle}>
            <span style={{ fontSize: '1.8rem' }}>🔥</span>
            <div style={{ marginTop: '10px' }}>
              <strong style={{ display: 'block', fontSize: '1.6rem', color: '#1e293b' }}>{advanced?.streak || 0} Days</strong>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Current Journaling Streak</span>
            </div>
          </div>
        </div>

        {advanced && (
          <div style={tipBannerStyle}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <span>
              <strong>Smart Tip:</strong> Your most reflective logging hour is 
              <strong style={{color: '#6366f1'}}> {advanced.peak_hour !== "N/A" ? `${advanced.peak_hour}:00` : "Calculating..."}</strong>. 
              Maintaining a consistent logging schedule improves trend accuracy.
            </span>
          </div>
        )}
      </div>

      {/* SECTION 3: KEY THEMES (Word Cloud) */}
      <div style={cardStyle}>
        <h4 style={labelStyle}>Key Themes & Topics</h4>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '25px' }}>
          Common topics extracted from your journal entries using text frequency analysis.
        </p>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '20px'
        }}>
          {words.length > 0 ? (
            words.map((w, i) => (
              <span key={i} style={{
                fontSize: `${Math.min(1 + w.value * 0.25, 2.8)}rem`, 
                fontWeight: '800',
                color: w.value > 2 ? '#6366f1' : '#94a3b8',
                opacity: Math.min(0.6 + w.value * 0.1, 1),
                padding: '0 10px',
                transition: 'all 0.3s ease'
              }}>
                {w.text}
              </span>
            ))
          ) : (
            <p style={{ color: '#94a3b8' }}>Log more journal notes to reveal common themes.</p>
          )}
        </div>
      </div>

      {/* SECTION 4: SLEEP CORRELATION */}
      <div style={cardStyle}>
        <h4 style={labelStyle}>Sleep vs. Mood Correlation</h4>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '25px' }}>Average rest hours associated with each emotional state.</p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px' 
        }}>
          {Object.entries(correlations).length > 0 ? (
            Object.entries(correlations).map(([mood, hours]) => (
              <div key={mood} style={statBoxStyle}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>{mood}</span>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#6366f1', margin: '5px 0' }}>{hours}h</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Avg. Duration</div>
              </div>
            ))
          ) : (
            <p style={{color: '#94a3b8', padding: '20px'}}>Submit more logs to view sleep patterns.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;