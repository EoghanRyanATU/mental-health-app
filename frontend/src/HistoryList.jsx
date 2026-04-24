// import { useState, useEffect } from 'react'

// function HistoryList() {
//   const [history, setHistory] = useState([])

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/api/history')
//       .then(res => res.json())
//       .then(data => setHistory(data))
//       .catch(err => console.error("Error fetching history:", err))
//   }, [])

//   return (
//     <div>
//       <h3>Your History</h3>
//       {history.length === 0 ? <p>No logs found. Start by adding one above!</p> : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//           {history.map((log) => (
//             <div key={log.id} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #646cff' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <strong>{log.mood}</strong>
//                 <small style={{ color: '#888' }}>{log.timestamp}</small>
//               </div>
//               <p style={{ margin: '5px 0' }}>{log.note}</p>
//               <em style={{ fontSize: '0.85rem' }}>Advice: {log.insight}</em>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default HistoryList

import { useState, useEffect } from 'react'

function HistoryList() {
  const [history, setHistory] = useState([])

  const fetchHistory = () => {
    fetch('http://127.0.0.1:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
  }

  useEffect(() => { fetchHistory() }, [])

// Logic to delete one specific row with confirmation
const deleteRow = async (id) => {
  // The confirmation dialog provides a safety net for the user (FR12)
  if (window.confirm("Are you sure you want to delete this specific log entry?")) {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/log/${id}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
        setHistory(history.filter(log => log.id !== id));
      } else {
        alert("Error: Could not delete the record from the database.");
      }
    } catch (err) {
      console.error("Delete request failed:", err);
    }
  }
}
  // Logic to wipe the entire log
  const clearAll = async () => {
    if (window.confirm("Are you sure? This will delete EVERY log forever.")) {
      const res = await fetch('http://127.0.0.1:5000/api/history/clear', { method: 'DELETE' });
      if (res.ok) setHistory([]);
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Your History</h3>
        {history.length > 0 && (
          <button onClick={clearAll} style={{ backgroundColor: '#000', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
            🗑️ Wipe Entire Log
          </button>
        )}
      </div>

      {history.length === 0 ? <p>No logs found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((log) => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #646cff' }}>
              <div style={{ flex: 1 }}>
                <strong>{log.mood}</strong> <small style={{ color: '#888' }}>{log.timestamp}</small>
                <p style={{ margin: '5px 0' }}>{log.note}</p>
                <em style={{ fontSize: '0.8rem' }}>Advice: {log.insight}</em>
              </div>
              
              {/* Individual Delete Button at the end of the row */}
              <button onClick={() => deleteRow(log.id)} style={{ marginLeft: '20px', backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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