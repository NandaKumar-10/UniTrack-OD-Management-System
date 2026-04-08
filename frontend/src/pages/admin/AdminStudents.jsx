import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const studentsRes = await fetch('http://localhost:5000/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!studentsRes.ok) throw new Error('Failed to fetch students');
      const studentsData = await studentsRes.json();
      
      const facultyRes = await fetch('http://localhost:5000/api/faculties');
      if (!facultyRes.ok) throw new Error('Failed to fetch faculties');
      const facultyData = await facultyRes.json();
      
      setStudents(studentsData);
      setFaculties(facultyData);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorChange = async (studentId, mentorId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/students/${studentId}/mentor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update mentor');
      }
      
      // Update local state to reflect the change
      setStudents(students.map(s => {
        if (s._id === studentId) {
          const selectedFaculty = faculties.find(f => f._id === mentorId);
          return { ...s, mentorId: selectedFaculty ? { _id: mentorId, name: selectedFaculty.name, email: selectedFaculty.email } : mentorId };
        }
        return s;
      }));
      
      setMessage({ type: 'success', text: 'Mentor updated successfully!' });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div className="container fade-in">Loading students...</div>;

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Users size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="page-title" style={{ marginBottom: 0 }}>Assign Mentors</h1>
      </div>
      <p className="page-subtitle">Assign faculty mentors to registered student accounts.</p>
      
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

      <div className="card">
        {students.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No student accounts found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Current Mentor</th>
                  <th>Assign/Change Mentor</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.rollNumber || 'N/A'}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      {student.mentorId ? (
                        <span className="badge badge-info">{student.mentorId.name}</span>
                      ) : (
                        <span className="badge badge-danger">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <select 
                        value={(student.mentorId && student.mentorId._id) || student.mentorId || ''} 
                        onChange={(e) => handleMentorChange(student._id, e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                      >
                        <option value="" disabled>Select Mentor</option>
                        {faculties.map(faculty => (
                          <option key={faculty._id} value={faculty._id}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
