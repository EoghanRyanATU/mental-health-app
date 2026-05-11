import { useState, useEffect } from 'react'

function HistoryList() {
  const [history, setHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState(null)

  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState(null);
  const [tempNote, setTempNote] = useState("");

  const fetchHistory = () => {
    fetch('http://127.0.0.1:5000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Fetch error:", err))
  }

  useEffect(() => { fetchHistory() }, [])
  
  // --- EDIT FUNCTIONS ---
  const startEditing = (e, log) => {
    e.stopPropagation(); // Stop card from collapsing
    setEditingId(log.id);
    setTempNote(log.note || "");
  };

  const cancelEditing = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setTempNote("");
  };

  const saveEdit = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/log/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: tempNote })
      });

      if (response.ok) {
        setHistory(history.map(log => 
          log.id === id ? { ...log, note: tempNote } : log
        ));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to save edit:", err);
    }
  };

  const toggleExpand = (id) => {
    // Prevent collapsing if we are currently editing this specific card
    if (editingId === id) return;
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
    (log.note && log.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

      <div style={timelineWrapperStyle}>
        <div style={verticalLineStyle}></div>

        {filteredHistory.length === 0 ? (
          <div style={emptyStateStyle}>
             <p>{searchTerm ? "No moments found." : "Your timeline is waiting for its first entry."}</p>
          </div>
        ) : (
          filteredHistory.map((log) => (
            <div key={log.id} style={{ position: 'relative', paddingLeft: '45px' }}>
              
              <div style={{
                ...dotStyle,
                borderColor: log.mood === 'Happy' ? '#22c55e' : log.mood === 'Sad' ? '#ef4444' : '#6366f1'
              }}></div>

              <div 
                onClick={() => toggleExpand(log.id)}
                style={{
                  ...entryCardStyle,
                  transform: expandedId === log.id ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: expandedId === log.id ? '0 10px 25px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
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

                {expandedId === log.id && (
                  <div style={expandedContainerStyle}>
                    <div style={diaryNoteWrapper}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={labelStyle}>Diary Reflection</h4>
                        
                        {/* EDIT TOGGLE */}
                        {editingId !== log.id ? (
                          <button onClick={(e) => startEditing(e, log)} style={editLinkStyle}>Edit Note</button>
                        ) : (
                          <button onClick={(e) => cancelEditing(e)} style={{ ...editLinkStyle, color: '#ef4444' }}>Cancel</button>
                        )}
                      </div>

                      {/* CONDITIONAL RENDER: TEXT VS EDIT AREA */}
                      {editingId === log.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <textarea 
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Stop click-to-collapse
                            style={editAreaStyle}
                          />
                          <button onClick={(e) => saveEdit(e, log.id)} style={saveButtonStyle}>Save Changes</button>
                        </div>
                      ) : (
                        <p style={noteContentStyle}>
                          {log.note || "A quiet moment with no notes recorded."}
                        </p>
                      )}
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

// --- STYLING CONSTANTS (Existing + New Edit Styles) ---

const editAreaStyle = {
  width: '100%',
  minHeight: '120px',
  padding: '12px',
  borderRadius: '12px',
  border: '2px solid #6366f1',
  fontFamily: 'inherit',
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: '#fff'
};

const saveButtonStyle = {
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  alignSelf: 'flex-end'
};

const editLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#6366f1',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  textDecoration: 'underline'
};

const timelineWrapperStyle = { position: 'relative', display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '20px' };
const verticalLineStyle = { position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 };
const dotStyle = { position: 'absolute', left: '11px', top: '22px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', border: '4px solid #6366f1', zIndex: 1, boxShadow: '0 0 0 4px #f1f5f9' };
const entryCardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left' };
const timestampStyle = { fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' };
const moodTitleStyle = { margin: '4px 0 0 0', fontSize: '1.4rem', color: '#1e293b', fontWeight: '800' };
const expandedContainerStyle = { marginTop: '25px', paddingTop: '25px', borderTop: '1px solid #f1f5f9' };
const diaryNoteWrapper = { marginBottom: '25px' };
const noteContentStyle = { fontSize: '1.05rem', lineHeight: '1.7', color: '#334155', margin: 0 };
const insightBannerStyle = { padding: '20px', backgroundColor: '#f8faff', borderRadius: '16px', border: '1px solid #eef2ff' };
const labelStyle = { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '10px' };
const searchInputStyle = { width: '100%', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '1rem', outline: 'none' };
const pillStyle = { fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', fontWeight: '600', color: '#475569' };
const wipeButtonStyle = { backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' };
const deleteLinkStyle = { background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' };
const emptyStateStyle = { padding: '80px 0', color: '#94a3b8', textAlign: 'center' };

export default HistoryList;