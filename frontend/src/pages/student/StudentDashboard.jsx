import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="container fade-in">
      <h1 className="page-title">Student Dashboard</h1>
      <p className="page-subtitle">Track your activities, apply for OD, and view department events.</p>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Pending ODs</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#92400E' }}>2</div>
        </div>
        <div className="card">
          <div className="card-title">Approved ODs</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>5</div>
        </div>
        <div className="card">
          <div className="card-title">Achievements Published</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>3</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Recent Event News</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Annual Tech Symposium</span>
                <span className="badge badge-info">External</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Join us for the national level tech symposium this coming Friday.</p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Department Coding Contest</span>
                <span className="badge badge-pending" style={{ background: '#E0E7FF', color: 'var(--primary)' }}>Internal</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Internal coding competition. Top 3 go to external events.</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="card-title">Your Recent Activity</h2>
          <table className="data-table">
             <thead>
               <tr>
                 <th>Type</th>
                 <th>Date</th>
                 <th>Status</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>OD: Tech Fest Participation</td>
                 <td>Oct 12, 2026</td>
                 <td><span className="badge badge-pending">Pending</span></td>
               </tr>
               <tr>
                 <td>Achievement: Coding Contest 1st Prize</td>
                 <td>Oct 10, 2026</td>
                 <td><span className="badge badge-approved">Published</span></td>
               </tr>
               <tr>
                 <td>OD: Hackathon</td>
                 <td>Sep 25, 2026</td>
                 <td><span className="badge badge-approved">Approved</span></td>
               </tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
