import { useState, useEffect } from 'react'

function HistoryList() {
  const [history, setHistory] = useState([])

  const fetchHistory = () => {
    fetch('http://127.0.0.1:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Fetch error:", err))
  }

  useEffect(() => { fetchHistory() }, [])

  // Logic to delete one specific row with confirmation (FR12)
  const deleteRow = async (id) => {
    if (window.confirm("Are you sure you want to delete this specific log entry?")) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/log/${id}`, { 
          method: 'DELETE' 
        });

        if (res.ok) {
          // Update state locally for immediate feedback
          setHistory(history.filter(log => log.id !== id));
        } else {
          alert("Error: Could not delete the record from the database.");
        }
      } catch (err) {
        console.error("Delete request failed:", err);
      }
    }
  }

  // Logic to wipe the entire log - URL updated to match backend /wipe route
  const clearAll = async () => {
    if (window.confirm("Are you sure? This will delete EVERY log forever.")) {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/history/wipe', { 
          method: 'DELETE' 
        });
        if (res.ok) setHistory([]);
      } catch (err) {
        console.error("Wipe request failed:", err);
      }
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ color: '#2c3e50' }}>Mood History</h3>
        {history.length > 0 && (
          <button onClick={clearAll} style={{ backgroundColor: '#000', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🗑️ Wipe Entire Log
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>No logs found. Start by adding your first mood!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {history.map((log) => (
            <div key={log.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px', 
              backgroundColor: '#fff', 
              borderRadius: '10px', 
              // Border color changes based on mood for better visualization
              borderLeft: `6px solid ${log.mood === 'Happy' ? '#4caf50' : log.mood === 'Sad' ? '#f44336' : '#2196f3'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <strong style={{ fontSize: '1.1rem' }}>{log.mood}</strong> 
                   <small style={{ color: '#888' }}>{log.timestamp}</small>
                </div>
                
                <p style={{ margin: '8px 0', color: '#444' }}>{log.note}</p>

                {/* Behavioral Tags Section (FR4) */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', backgroundColor: '#f0f2f5', padding: '4px 10px', borderRadius: '20px' }}>
                    😴 {log.sleep_hours} hrs sleep
                  </span>
                  {log.exercise === 1 && (
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                      🏃 Exercised
                    </span>
                  )}
                </div>

                <div style={{ padding: '10px', backgroundColor: '#f8f9ff', borderRadius: '6px', border: '1px solid #eef2ff' }}>
                  <em style={{ fontSize: '0.85rem', color: '#646cff' }}><strong>Advice:</strong> {log.insight}</em>
                </div>
              </div>
              
              {/* Individual Delete Button */}
              <button 
                onClick={() => deleteRow(log.id)} 
                style={{ 
                  marginLeft: '20px', 
                  backgroundColor: 'transparent', 
                  border: '1px solid #ff4d4d', 
                  color: '#ff4d4d', 
                  padding: '5px 12px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '0.8rem' 
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryList