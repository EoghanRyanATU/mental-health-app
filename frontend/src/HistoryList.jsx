// import { useState, useEffect } from 'react'

// function HistoryList() {
//   const [history, setHistory] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [expandedId, setExpandedId] = useState(null) // Tracks which log is expanded

//   const fetchHistory = () => {
//     fetch('http://127.0.0.1:5000/api/history')
//       .then(res => res.json())
//       .then(data => setHistory(data))
//       .catch(err => console.error("Fetch error:", err))
//   }

//   useEffect(() => { fetchHistory() }, [])

//   // Toggle accordion state
//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id)
//   }

//   const deleteRow = async (e, id) => {
//     e.stopPropagation(); // Prevents the accordion from toggling when clicking delete
//     if (window.confirm("Are you sure you want to delete this specific log entry?")) {
//       try {
//         const res = await fetch(`http://127.0.0.1:5000/api/log/${id}`, { method: 'DELETE' });
//         if (res.ok) setHistory(history.filter(log => log.id !== id));
//       } catch (err) {
//         console.error("Delete request failed:", err);
//       }
//     }
//   }

//   const clearAll = async () => {
//     if (window.confirm("CRITICAL: This will delete EVERY log forever. Proceed?")) {
//       try {
//         const res = await fetch('http://127.0.0.1:5000/api/history/wipe', { method: 'DELETE' });
//         if (res.ok) setHistory([]);
//       } catch (err) {
//         console.error("Wipe request failed:", err);
//       }
//     }
//   }

//   // Frontend Filter logic
//   const filteredHistory = history.filter(log => 
//     log.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     log.mood.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
//       {/* 🛠️ JOURNAL CONTROLS */}
//       <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
//         <div style={{ position: 'relative', flex: 1 }}>
//           <input 
//             type="text" 
//             placeholder="Search your notes or moods..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={searchInputStyle}
//           />
//           <span style={{ position: 'absolute', right: '15px', top: '12px', color: '#94a3b8' }}>🔍</span>
//         </div>
        
//         {history.length > 0 && (
//           <button onClick={clearAll} style={wipeButtonStyle}>
//             Wipe All
//           </button>
//         )}
//       </div>

//       {/* 📔 ENTRY LIST */}
//       {filteredHistory.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', backgroundColor: '#fff', borderRadius: '20px' }}>
//           <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>📁</span>
//           <p>{searchTerm ? "No matches found for that search." : "Your journal is empty. Log a mood to begin!"}</p>
//         </div>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           {filteredHistory.map((log) => (
//             <div key={log.id} style={{
//               ...entryCardStyle,
//               borderLeft: `6px solid ${log.mood === 'Happy' ? '#22c55e' : log.mood === 'Sad' ? '#ef4444' : '#6366f1'}`
//             }}>
              
//               {/* COMPACT SUMMARY HEADER */}
//               <div 
//                 onClick={() => toggleExpand(log.id)}
//                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//                   <div style={{ textAlign: 'left' }}>
//                     <strong style={{ fontSize: '1.1rem', color: '#1e293b', display: 'block' }}>{log.mood}</strong>
//                     <small style={{ color: '#94a3b8' }}>{log.timestamp}</small>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                   <span style={pillStyle}>😴 {log.sleep_hours}h</span>
//                   {log.exercise === 1 && <span style={pillStyle}>🏃</span>}
//                   <span style={{ 
//                     transform: expandedId === log.id ? 'rotate(180deg)' : 'rotate(0deg)', 
//                     transition: '0.3s', color: '#94a3b8' 
//                   }}>▼</span>
//                 </div>
//               </div>

//               {/* EXPANDED DETAIL VIEW */}
//               {expandedId === log.id && (
//                 <div style={expandedContentStyle}>
//                   <div style={{ marginBottom: '20px' }}>
//                     <h4 style={sectionLabelStyle}>Diary Note</h4>
//                     <p style={{ color: '#334155', lineHeight: '1.6', margin: 0 }}>
//                       {log.note || "No notes were added for this entry."}
//                     </p>
//                   </div>

//                   <div style={insightBoxStyle}>
//                     <strong style={{ color: '#6366f1', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rule-Based Insight</strong>
//                     <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#475569' }}>"{log.insight}"</p>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
//                     <button onClick={(e) => deleteRow(e, log.id)} style={deleteButtonStyle}>
//                       Delete Permanently
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // --- STYLING CONSTANTS ---

// const searchInputStyle = {
//   width: '100%',
//   padding: '12px 45px 12px 15px',
//   borderRadius: '12px',
//   border: '1px solid #e2e8f0',
//   fontSize: '0.95rem',
//   outline: 'none',
//   transition: 'border 0.2s',
//   backgroundColor: '#fff'
// };

// const entryCardStyle = {
//   backgroundColor: '#ffffff',
//   padding: '18px 25px',
//   borderRadius: '16px',
//   boxShadow: '0 2px 4px rgba(15, 23, 42, 0.04)',
//   transition: 'all 0.2s ease',
// };

// const pillStyle = {
//   fontSize: '0.75rem',
//   backgroundColor: '#f1f5f9',
//   padding: '5px 10px',
//   borderRadius: '8px',
//   fontWeight: '600',
//   color: '#475569'
// };

// const expandedContentStyle = {
//   marginTop: '20px',
//   paddingTop: '20px',
//   borderTop: '1px solid #f1f5f9',
//   textAlign: 'left'
// };

// const sectionLabelStyle = {
//   fontSize: '0.75rem',
//   color: '#94a3b8',
//   textTransform: 'uppercase',
//   letterSpacing: '0.05em',
//   marginBottom: '8px'
// };

// const insightBoxStyle = {
//   padding: '15px',
//   backgroundColor: '#f8fafc',
//   borderRadius: '12px',
//   borderLeft: '4px solid #6366f1'
// };

// const wipeButtonStyle = {
//   backgroundColor: '#1e293b',
//   color: '#fff',
//   padding: '12px 20px',
//   border: 'none',
//   borderRadius: '12px',
//   cursor: 'pointer',
//   fontWeight: 'bold',
//   fontSize: '0.85rem'
// };

// const deleteButtonStyle = {
//   backgroundColor: 'transparent',
//   color: '#ef4444',
//   border: '1px solid #fee2e2',
//   padding: '6px 12px',
//   borderRadius: '8px',
//   fontSize: '0.75rem',
//   cursor: 'pointer',
//   transition: 'all 0.2s'
// };

// export default HistoryList;

import { useState, useEffect } from 'react'

function HistoryList() {
  const [history, setHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState(null)

  const fetchHistory = () => {
    fetch('http://127.0.0.1:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Fetch error:", err))
  }

  useEffect(() => { fetchHistory() }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const deleteRow = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this memory permanently?")) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/log/${id}`, { method: 'DELETE' });
        if (res.ok) setHistory(history.filter(log => log.id !== id));
      } catch (err) {
        console.error("Delete request failed:", err);
      }
    }
  }

  const clearAll = async () => {
    if (window.confirm("This will erase your entire timeline. Are you sure?")) {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/history/wipe', { method: 'DELETE' });
        if (res.ok) setHistory([]);
      } catch (err) {
        console.error("Wipe request failed:", err);
      }
    }
  }

  const filteredHistory = history.filter(log => 
    log.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.mood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 🔍 SEARCH & CONTROLS */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search through your journey..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <span style={{ position: 'absolute', right: '15px', top: '12px', opacity: 0.5 }}>🔍</span>
        </div>
        {history.length > 0 && (
          <button onClick={clearAll} style={wipeButtonStyle}>Wipe Timeline</button>
        )}
      </div>

      {/* 🛤️ TIMELINE FEED */}
      <div style={timelineWrapperStyle}>
        {/* The Vertical Thread */}
        <div style={verticalLineStyle}></div>

        {filteredHistory.length === 0 ? (
          <div style={emptyStateStyle}>
             <p>{searchTerm ? "No moments found." : "Your timeline is waiting for its first entry."}</p>
          </div>
        ) : (
          filteredHistory.map((log) => (
            <div key={log.id} style={{ position: 'relative', paddingLeft: '45px' }}>
              
              {/* Timeline Indicator (Dot) */}
              <div style={{
                ...dotStyle,
                borderColor: log.mood === 'Happy' ? '#22c55e' : log.mood === 'Sad' ? '#ef4444' : '#6366f1'
              }}></div>

              {/* Entry Card */}
              <div 
                onClick={() => toggleExpand(log.id)}
                style={{
                  ...entryCardStyle,
                  transform: expandedId === log.id ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: expandedId === log.id ? '0 10px 25px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
              >
                
                {/* CARD HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={timestampStyle}>{log.timestamp}</span>
                    <h3 style={moodTitleStyle}>{log.mood}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={pillStyle}>😴 {log.sleep_hours}h</span>
                    {log.exercise === 1 && <span style={pillStyle}>🏃</span>}
                  </div>
                </div>

                {/* EXPANDED DIARY SECTION */}
                {expandedId === log.id && (
                  <div style={expandedContainerStyle}>
                    <div style={diaryNoteWrapper}>
                      <h4 style={labelStyle}>Diary Reflection</h4>
                      <p style={noteContentStyle}>
                        {log.note || "A quiet moment with no notes recorded."}
                      </p>
                    </div>

                    <div style={insightBannerStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '1rem' }}>✨</span>
                        <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6366f1' }}>Insight Engine</strong>
                      </div>
                      <p style={{ margin: 0, fontStyle: 'italic', color: '#475569', fontSize: '0.9rem' }}>
                        "{log.insight}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button onClick={(e) => deleteRow(e, log.id)} style={deleteLinkStyle}>
                        Delete this entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// --- SLEEK STYLING CONSTANTS ---

const timelineWrapperStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  paddingBottom: '20px'
};

const verticalLineStyle = {
  position: 'absolute',
  left: '20px',
  top: '10px',
  bottom: '10px',
  width: '2px',
  backgroundColor: '#e2e8f0',
  zIndex: 0
};

const dotStyle = {
  position: 'absolute',
  left: '11px',
  top: '22px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  border: '4px solid #6366f1',
  zIndex: 1,
  boxShadow: '0 0 0 4px #f1f5f9'
};

const entryCardStyle = {
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '20px',
  border: '1px solid #f1f5f9',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textAlign: 'left'
};

const timestampStyle = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  fontWeight: '500'
};

const moodTitleStyle = {
  margin: '4px 0 0 0',
  fontSize: '1.4rem',
  color: '#1e293b',
  fontWeight: '800'
};

const expandedContainerStyle = {
  marginTop: '25px',
  paddingTop: '25px',
  borderTop: '1px solid #f1f5f9',
  animation: 'fadeIn 0.4s ease'
};

const diaryNoteWrapper = {
  marginBottom: '25px'
};

const noteContentStyle = {
  fontSize: '1.05rem',
  lineHeight: '1.7',
  color: '#334155',
  margin: 0
};

const insightBannerStyle = {
  padding: '20px',
  backgroundColor: '#f8faff',
  borderRadius: '16px',
  border: '1px solid #eef2ff'
};

const labelStyle = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#94a3b8',
  marginBottom: '10px'
};

const searchInputStyle = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
};

const pillStyle = {
  fontSize: '0.75rem',
  backgroundColor: '#f1f5f9',
  padding: '6px 12px',
  borderRadius: '10px',
  fontWeight: '600',
  color: '#475569'
};

const wipeButtonStyle = {
  backgroundColor: '#1e293b',
  color: '#fff',
  border: 'none',
  padding: '12px 25px',
  borderRadius: '14px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const deleteLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  fontSize: '0.8rem',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const emptyStateStyle = {
  padding: '80px 0',
  color: '#94a3b8',
  textAlign: 'center'
}

export default HistoryList;