import { useState, useEffect } from 'react'

function HistoryList() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Error fetching history:", err))
  }, [])

  return (
    <div>
      <h3>Your History</h3>
      {history.length === 0 ? <p>No logs found. Start by adding one above!</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((log) => (
            <div key={log.id} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #646cff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{log.mood}</strong>
                <small style={{ color: '#888' }}>{log.timestamp}</small>
              </div>
              <p style={{ margin: '5px 0' }}>{log.note}</p>
              <em style={{ fontSize: '0.85rem' }}>Advice: {log.insight}</em>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryList