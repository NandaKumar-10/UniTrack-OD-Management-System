import React, { useState, useEffect } from 'react';

const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/faculty/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/faculty/ods/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error(`Failed to ${status.toLowerCase()} OD`);
      
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="container fade-in">Loading dashboard...</div>;
  if (error) return <div className="container fade-in" style={{color: 'var(--danger)'}}><strong>Error:</strong> {error}</div>;

  return (
    <div className="container fade-in">
      <h1 className="page-title">Faculty Dashboard</h1>
      <p className="page-subtitle">Review OD applications and monitor student activities.</p>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Pending OD Approvals</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#92400E' }}>{data.stats.pendingApprovals}</div>
        </div>
        <div className="card">
          <div className="card-title">Total ODs Approved</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{data.stats.totalOdsApproved}</div>
        </div>
        <div className="card">
          <div className="card-title">Total Achievements (Month)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{data.stats.achievementsMonth}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">Recent Pending Applications</h2>
        {data.pendingOds.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No pending applications requiring your review.</p>
        ) : (
          <table className="data-table">
             <thead>
               <tr>
                 <th>Date & Time</th>
                 <th>Student</th>
                 <th>Event Details</th>
                 <th>Description</th>
                 <th>Proof</th>
                 <th>Actions</th>
               </tr>
             </thead>
             <tbody>
               {data.pendingOds.map(od => (
                 <tr key={od._id}>
                   <td>
                    {od.startDate ? (
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>{new Date(od.startDate).toLocaleDateString()} <span style={{ color: 'var(--text-muted)' }}>{od.startTime}</span></div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '2px 0' }}>to</div>
                        <div>{new Date(od.endDate).toLocaleDateString()} <span style={{ color: 'var(--text-muted)' }}>{od.endTime}</span></div>
                      </div>
                    ) : ( 
                      new Date(od.date).toLocaleDateString()
                    )}
                   </td>
                   <td style={{ fontWeight: 500 }}>{od.studentName}</td>
                   <td>
                     <div style={{ fontWeight: 500 }}>{od.eventName}</div>
                     {od.venue && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {od.venue}</div>}
                   </td>
                   <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={od.description || od.reason}>
                     {od.description || od.reason}
                   </td>
                   <td>
                     {od.proofLink ? (
                       <a href={od.proofLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>View Proof</a>
                     ) : (
                       <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>N/A</span>
                     )}
                   </td>
                   <td>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button onClick={() => handleAction(od._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Approve</button>
                       <button onClick={() => handleAction(od._id, 'Rejected')} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Reject</button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
