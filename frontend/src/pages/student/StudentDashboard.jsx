import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/student/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data. Please try logging out and in again.');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="container fade-in">Loading dashboard...</div>;
  if (error) return <div className="container fade-in" style={{color: 'var(--danger)'}}><strong>Error:</strong> {error}</div>;

  return (
    <div className="container fade-in">
      <h1 className="page-title">Student Dashboard</h1>
      <p className="page-subtitle">Track your activities, apply for OD, and view department events.</p>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Pending ODs</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#92400E' }}>{data.stats.pendingOds}</div>
        </div>
        <div className="card">
          <div className="card-title">Approved ODs</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{data.stats.approvedOds}</div>
        </div>
        <div className="card">
          <div className="card-title">Achievements Published</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{data.stats.achievementsCount}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Recent Event News</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.recentEvents.length === 0 ? (
              <p>No recent events found.</p>
            ) : (
              data.recentEvents.map(event => (
                <div key={event.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{event.title}</span>
                    <span className={`badge ${event.type === 'External' ? 'badge-info' : 'badge-pending'}`} style={event.type === 'Internal' ? { background: '#E0E7FF', color: 'var(--primary)' } : {}}>
                      {event.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{event.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">Your Recent Activity</h2>
          {data.recentActivity.length === 0 ? (
            <p>No recent activity yet.</p>
          ) : (
            <table className="data-table">
               <thead>
                 <tr>
                   <th>Type</th>
                   <th>Date</th>
                   <th>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {data.recentActivity.map((act, index) => (
                   <tr key={index}>
                     <td>{act.type}</td>
                     <td>{new Date(act.date).toLocaleDateString()}</td>
                     <td>
                       <span className={`badge ${act.status === 'Pending' ? 'badge-pending' : 'badge-approved'}`}>
                         {act.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
