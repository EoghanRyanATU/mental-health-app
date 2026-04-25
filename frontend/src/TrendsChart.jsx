import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data to test the UI
const mockData = [
  { date: '2026-04-20', moodScore: 3 },
  { date: '2026-04-21', moodScore: 2 },
  { date: '2026-04-22', moodScore: 4 },
  { date: '2026-04-23', moodScore: 1 },
];

function TrendsChart() {
  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ddd' }}>
      <h4>Mood Trends (Beta)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
          <Tooltip />
          <Line type="monotone" dataKey="moodScore" stroke="#646cff" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendsChart;