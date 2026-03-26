import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container fade-in">
      <h1 className="page-title">Department Admin</h1>
      <p className="page-subtitle">Manage department events and generate monthly activity summaries.</p>
      
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h2 className="card-title">Publish Event News</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input type="text" className="form-input" placeholder="e.g. Annual Hackathon" />
            </div>
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select className="form-input">
                <option>Internal Department Event</option>
                <option>External Inter-College Event</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" placeholder="Event details..."></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Event</button>
          </form>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="card-title">Monthly Activity Summary Module</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Automatically collect data from events and student activities to generate a structured department highlights report.
          </p>
          
          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Period: <span style={{ color: 'var(--primary)' }}>October 2026</span></span>
              <span className="badge badge-info">Ready to Generate</span>
            </div>
            <ul style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>14 Events Conducted</li>
              <li>45 Student Achievements Logged</li>
              <li>120 ODs Approved</li>
            </ul>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--secondary)' }}>
            Generate Executive Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
