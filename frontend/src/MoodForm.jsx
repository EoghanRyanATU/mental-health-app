import { useState } from 'react';

// 1. Added 'user' to the props
function MoodForm({ user, onLogAdded }) {
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');
  const [insight, setInsight] = useState('');
  const [sleep, setSleep] = useState(8);
  const [exercise, setExercise] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. Added user_id to the payload so the backend knows who owns this log
    const payload = {
      user_id: user.user_id, 
      mood,
      note,
      sleep_hours: parseInt(sleep),
      exercise: exercise ? 1 : 0 
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setInsight(data.insight); 
        setNote(''); 
        if (onLogAdded) onLogAdded(); 
      }
    } catch (error) {
      console.error("Error logging mood:", error);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TOP ROW: Mood Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Current Mood</label>
          <select 
            value={mood} 
            onChange={(e) => setMood(e.target.value)} 
            style={inputStyle}
          >
            <option>Happy</option>
            <option>Neutral</option>
            <option>Anxious</option>
            <option>Sad</option>
          </select>
        </div>

        {/* MIDDLE ROW: The "Mini Diary" Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Diary Reflection</label>
          <textarea 
            placeholder="Write a few lines about your day..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
          />
        </div>

        {/* BOTTOM ROW: Behavioral Data */}
        <div style={statsRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>😴</span>
            <input 
              type="number" 
              value={sleep} 
              onChange={(e) => setSleep(e.target.value)} 
              min="0" max="24"
              style={smallInputStyle}
            />
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>hrs sleep</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.2rem' }}>🏃</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Exercised?</span>
            <input 
              type="checkbox" 
              checked={exercise} 
              onChange={(e) => setExercise(e.target.checked)} 
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>
        </div>

        <button type="submit" style={buttonStyle}>
          Save Daily Entry
        </button>
      </form>

      {/* Insight Display */}
      {insight && (
        <div style={insightBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span>✨</span>
            <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6366f1' }}>Instant Insight</strong>
          </div>
          <p style={{ margin: 0, fontStyle: 'italic', color: '#475569' }}>{insight}</p>
        </div>
      )}
    </div>
  );
}

// --- STYLES (Keep exactly as they were) ---
const labelStyle = { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700' };
const inputStyle = { padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8fafc' };
const statsRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#f1f5f9', borderRadius: '12px' };
const smallInputStyle = { width: '50px', padding: '5px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center' };
const buttonStyle = { backgroundColor: '#6366f1', color: 'white', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' };
const insightBoxStyle = { marginTop: '25px', padding: '20px', backgroundColor: '#f0f4ff', borderRadius: '16px', border: '1px solid #dbeafe' };

export default MoodForm;