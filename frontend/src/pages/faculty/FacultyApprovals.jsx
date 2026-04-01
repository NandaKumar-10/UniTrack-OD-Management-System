import React, { useState, useEffect } from 'react';

const FacultyApprovals = () => {
  const [ods, setOds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOds();
  }, []);

  const fetchOds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/faculty/ods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch ODs');
      const data = await response.json();
      setOds(data);
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
      
      fetchOds();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="container fade-in">Loading approvals...</div>;
  if (error) return <div className="container fade-in" style={{color: 'var(--danger)'}}><strong>Error:</strong> {error}</div>;

  return (
    <div className="container fade-in">
      <h1 className="page-title">OD Approvals</h1>
      <p className="page-subtitle">Manage all student On-Duty applications</p>

      <div className="card">
        {ods.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No OD applications found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Event Details</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ods.map(od => (
                <tr key={od._id}>
                  <td>{new Date(od.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 500 }}>{od.studentName}</td>
                  <td>{od.eventName}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={od.reason}>
                    {od.reason}
                  </td>
                  <td>
                    <span className={`status-badge status-${od.status.toLowerCase()}`}>
                      {od.status}
                    </span>
                  </td>
                  <td>
                    {od.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleAction(od._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Approve</button>
                        <button onClick={() => handleAction(od._id, 'Rejected')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Reviewed</span>
                    )}
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

export default FacultyApprovals;
