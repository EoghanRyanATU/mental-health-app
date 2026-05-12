import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 1. Added 'user' prop to handle data isolation
function TrendsChart({ user }) {
  const [chartData, setChartData] = useState([]);

  const moodMap = {
    'Happy': 4,
    'Neutral': 3,
    'Anxious': 2,
    'Sad': 1
  };

  useEffect(() => {
    // 2. Updated fetch to include the specific user_id
    if (!user) return;
    
    fetch(`http://127.0.0.1:5000/api/history?user_id=${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(log => ({
          date: log.timestamp.split(' ')[0], 
          moodScore: moodMap[log.mood] || 0,
          originalMood: log.mood
        })).reverse(); 

        setChartData(formattedData);
      })
      .catch(err => console.error("Chart data mapping error:", err));
      
    // 3. Re-run effect if the user changes
  }, [user.user_id]);

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
      <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Your Personal Mood Trends</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} fontSize={12} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="moodScore" 
            stroke="#646cff" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#646cff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendsChart;