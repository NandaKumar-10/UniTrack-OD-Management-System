import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [eventName, setEventName] = useState('');
  const [rank, setRank] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/achievements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch achievements');
      const data = await res.json();
      setAchievements(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
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
      const res = await fetch('http://localhost:5000/api/student/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventName, rank, date, description })
      });
      if (!res.ok) throw new Error('Failed to sumbit achievement');
      
      setEventName('');
      setRank('');
      setDate('');
      setDescription('');
      fetchAchievements();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container fade-in">Loading Achievements...</div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Trophy size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Achievements</h1>
      </div>
      <p className="page-subtitle">Log your competition wins, participation awards, and technical milestones.</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Submit New Achievement</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Name</label>
              <input 
                type="text" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                placeholder="e.g. CodeChef Global Hackathon"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Rank / Award</label>
              <input 
                type="text" 
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                placeholder="e.g. 1st Place, Finalist, Certificate"
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description & Proof</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="3"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'inherit' }}
                placeholder="Details of the event and link to certificate/project"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {submitting ? 'Submitting...' : 'Log Achievement'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">Achievement History</h2>
          {achievements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No achievements logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{ach.eventName}</span>
                    <span className="badge badge-approved">{ach.rank}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {new Date(ach.date).toLocaleDateString()}
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{ach.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
