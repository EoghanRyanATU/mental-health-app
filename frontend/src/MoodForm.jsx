// import { useState } from 'react'

// function MoodForm() {
//   const [mood, setMood] = useState('Happy')
//   const [note, setNote] = useState('')
//   const [insight, setInsight] = useState('')
//   const [sleep, setSleep] = useState(8);
//   const [exercise, setExercise] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const response = await fetch('http://127.0.0.1:5000/api/log', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ mood, note })
//     })
//     const data = await response.json()
//     setInsight(data.insight)
//   }

//   return (
//     <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
//       <h3>How are you feeling?</h3>
//       <form onSubmit={handleSubmit}>
//         <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
//           <option value="Happy">Happy 😊</option>
//           <option value="Neutral">Neutral 😐</option>
//           <option value="Anxious">Anxious 😰</option>
//           <option value="Sad">Sad 😢</option>
//         </select>
//         <input 
//           type="text" 
//           placeholder="Add a note..." 
//           value={note} 
//           onChange={(e) => setNote(e.target.value)}
//           style={{ padding: '8px', width: '200px' }}
//         />
//         <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>Save Log</button>
//       </form>
//       {insight && <p style={{ color: '#646cff', marginTop: '15px' }}><strong>Insight:</strong> {insight}</p>}
//     </div>
//   )
// }

// export default MoodForm

import { useState } from 'react';

function MoodForm({ onLogAdded }) {
  const [mood, setMood] = useState('Happy');
  const [note, setNote] = useState('');
  const [insight, setInsight] = useState('');
  const [sleep, setSleep] = useState(8);
  const [exercise, setExercise] = useState(false); // Fixed: lowercase 'false'


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      mood: mood,
      note: note,
      sleep_hours: parseInt(sleep), // Ensure it's a number
      exercise: exercise
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
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Mood and Note Row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={mood} 
            onChange={(e) => setMood(e.target.value)} 
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option>Happy</option>
            <option>Neutral</option>
            <option>Anxious</option>
            <option>Sad</option>
          </select>

          <input 
            type="text" 
            placeholder="How are you feeling?" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Behavioral Tags Row (FR4) */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
          <label>
            😴 Sleep: 
            <input 
              type="number" 
              value={sleep} 
              onChange={(e) => setSleep(e.target.value)} 
              min="0" max="24"
              style={{ width: '45px', marginLeft: '5px', padding: '5px' }}
            /> hrs
          </label>

          <label style={{ cursor: 'pointer' }}>
            🏃 Exercised today? 
            <input 
              type="checkbox" 
              checked={exercise} 
              onChange={(e) => setExercise(e.target.checked)} 
              style={{ marginLeft: '5px', transform: 'scale(1.2)' }}
            />
          </label>
        </div>

        <button 
          type="submit" 
          style={{ backgroundColor: '#646cff', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Save Daily Log
        </button>
      </form>

      {/* Insight Display (FR3) */}
      {insight && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef2ff', borderRadius: '8px', borderLeft: '5px solid #646cff' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>💡 Insight:</strong>
          <span style={{ fontStyle: 'italic', color: '#444' }}>{insight}</span>
        </div>
      )}
    </div>
  );
}

export default MoodForm;