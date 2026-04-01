import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const ODApplications = () => {
  const [ods, setOds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOds();
  }, []);

  const fetchOds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/ods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch ODs');
      const data = await res.json();
      setOds(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/ods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventName, date, reason })
      });
      if (!res.ok) throw new Error('Failed to submit OD application');
      
      setEventName('');
      setDate('');
      setReason('');
      fetchOds();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container fade-in">Loading ODs...</div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Calendar size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="page-title" style={{ marginBottom: 0 }}>My OD Applications</h1>
      </div>
      <p className="page-subtitle">Apply for On-Duty and check the status of your past applications.</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Apply for New OD</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Name</label>
              <input 
                type="text" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                placeholder="e.g. Hackathon 2026"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reason</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="3"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'inherit' }}
                placeholder="Describe your role and why OD is needed"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">Application History</h2>
          {ods.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No applications found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ods.map(od => (
                  <tr key={od.id}>
                    <td>{od.eventName}</td>
                    <td>{new Date(od.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${od.status === 'Pending' ? 'badge-pending' : od.status === 'Approved' ? 'badge-approved' : 'badge-danger'}`}>
                        {od.status}
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

export default ODApplications;
