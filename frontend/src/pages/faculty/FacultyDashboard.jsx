import React from 'react';

const FacultyDashboard = () => {
  return (
    <div className="container fade-in">
      <h1 className="page-title">Faculty Dashboard</h1>
      <p className="page-subtitle">Review OD applications and monitor student activities.</p>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Pending OD Approvals</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#92400E' }}>12</div>
        </div>
        <div className="card">
          <div className="card-title">Students on OD Today</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>8</div>
        </div>
        <div className="card">
          <div className="card-title">Total Achievements (Month)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>24</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title">Pending OD Applications</h2>
        <table className="data-table">
           <thead>
             <tr>
               <th>Student ID</th>
               <th>Name</th>
               <th>Event Details</th>
               <th>Date</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td style={{ fontWeight: 500 }}>21BCE045</td>
               <td>Alex Johnson</td>
               <td>National Hackathon (External)</td>
               <td>Oct 15 - Oct 16</td>
               <td>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Approve</button>
                   <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Reject</button>
                 </div>
               </td>
             </tr>
             <tr>
               <td style={{ fontWeight: 500 }}>21BCE088</td>
               <td>Samantha Lee</td>
               <td>Robotics Workshop (Internal)</td>
               <td>Oct 14</td>
               <td>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Approve</button>
                   <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Reject</button>
                 </div>
               </td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyDashboard;
