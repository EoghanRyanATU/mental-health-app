import { useState } from 'react'

function MoodForm() {
  const [mood, setMood] = useState('Happy')
  const [note, setNote] = useState('')
  const [insight, setInsight] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('http://127.0.0.1:5000/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, note })
    })
    const data = await response.json()
    setInsight(data.insight)
  }

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '10px' }}>
      <h3>How are you feeling?</h3>
      <form onSubmit={handleSubmit}>
        <select value={mood} onChange={(e) => setMood(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="Happy">Happy 😊</option>
          <option value="Neutral">Neutral 😐</option>
          <option value="Anxious">Anxious 😰</option>
          <option value="Sad">Sad 😢</option>
        </select>
        <input 
          type="text" 
          placeholder="Add a note..." 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>Save Log</button>
      </form>
      {insight && <p style={{ color: '#646cff', marginTop: '15px' }}><strong>Insight:</strong> {insight}</p>}
    </div>
  )
}

export default MoodForm