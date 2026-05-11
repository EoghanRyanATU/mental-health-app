import React from 'react';

const Resources = () => {
  const links = [
    { title: "Crisis Text Line", contact: "Text HOME to 741741", desc: "Free, 24/7 support for those in crisis." },
    { name: "Mindfulness Basics", contact: "Internal Tool", desc: "Try 4-7-8 Breathing: Inhale 4s, Hold 7s, Exhale 8s." },
    { title: "NAMI", contact: "nami.org", desc: "National Alliance on Mental Illness resources and support." }
  ];

  return (
    <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Support & Resources</h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>Professional tools to help you manage your mental well-being.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {links.map((link, i) => (
          <div key={i} style={cardStyle}>
            <h3 style={{ margin: '0 0 5px 0', color: '#6366f1' }}>{link.title || link.name}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 10px 0' }}>{link.contact}</p>
            <p style={{ color: '#475569', margin: 0 }}>{link.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

export default Resources;