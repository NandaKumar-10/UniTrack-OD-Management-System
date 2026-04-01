import React, { useState } from 'react';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create faculty account');
      }

      setMessage({ type: 'success', text: 'Faculty account created successfully!' });
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage system users and view high-level summaries.</p>
      
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 className="card-title">Create Faculty Credentials</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Generate access credentials for new department faculty members.
          </p>

          {message.text && (
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              backgroundColor: message.type === 'error' ? '#fee2e2' : '#d1fae5',
              color: message.type === 'error' ? '#991b1b' : '#065f46'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleCreateFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="e.g. Dr. Jane Smith" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder="faculty@college.edu" />
            </div>
            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <input type="text" name="password" value={formData.password} onChange={handleChange} required className="form-input" placeholder="Set a secure password" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--primary-light)', border: 'none' }}>
           <h2 className="card-title" style={{ color: 'var(--primary)' }}>System Overview</h2>
           <p style={{ color: 'var(--primary-hover)', marginTop: '0.5rem' }}>
             Welcome to the UniTrack administrator panel. From here you can:
           </p>
           <ul style={{ color: 'var(--primary-hover)', marginTop: '1rem', marginLeft: '1.5rem', lineHeight: '1.8' }}>
             <li>Create and distribute credentials for faculty members.</li>
             <li>Publish upcoming department and college events to the student portal.</li>
             <li>Manage (Edit/Delete) existing events.</li>
             <li>Generate dynamic, real-time PDF executive summaries of college activities.</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
