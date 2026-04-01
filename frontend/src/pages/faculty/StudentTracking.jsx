import React, { useState, useEffect } from 'react';

const StudentTracking = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/faculty/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container fade-in">Loading students...</div>;
  if (error) return <div className="container fade-in" style={{color: 'var(--danger)'}}><strong>Error:</strong> {error}</div>;

  return (
    <div className="container fade-in">
      <h1 className="page-title">Student Tracking</h1>
      <p className="page-subtitle">Monitor student engagement, ODs taken, and achievements</p>

      <div className="card">
        {students.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No students registered.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Approved ODs</th>
                <th>Achievements</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                  <td>
                    <span style={{ fontWeight: 500, color: student.approvedOdsCount > 5 ? 'var(--danger)' : 'inherit' }}>
                      {student.approvedOdsCount}
                    </span>
                  </td>
                  <td>
                     {student.achievementsCount}
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

export default StudentTracking;
