import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Calendar } from 'lucide-react';

const StudentTracking = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [studentOds, setStudentOds] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // PDF Export States
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);

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
      
      // Sort by roll number
      const sortedData = data.sort((a, b) => (a.rollNumber || '').localeCompare(b.rollNumber || ''));
      setStudents(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (student) => {
    setSelectedStudent(student);
    setLoadingDetails(true);
    setStudentAchievements([]);
    setStudentOds([]);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch achievements
      const achRes = await fetch(`http://localhost:5000/api/faculty/students/${student._id}/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (achRes.ok) {
        const achData = await achRes.json();
        setStudentAchievements(achData);
      }

      // Fetch ODs
      const odRes = await fetch(`http://localhost:5000/api/faculty/students/${student._id}/ods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (odRes.ok) {
        const odData = await odRes.json();
        setStudentOds(odData);
      }
      
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const generatePDF = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both 'From' and 'To' dates.");
      return;
    }
    
    setGeneratingPdf(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/faculty/ods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch ODs for reporting');
      const allOds = await response.json();

      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      // Filter for Approved and within date range
      let filteredOds = allOds.filter(od => {
        if (od.status !== 'Approved') return false;
        const odDate = new Date(od.startDate || od.date);
        return odDate >= start && odDate <= end;
      });

      // Sort by Student Roll Number
      filteredOds.sort((a, b) => {
        const rollA = a.studentRollNumber || 'ZZZ';
        const rollB = b.studentRollNumber || 'ZZZ';
        return rollA.localeCompare(rollB);
      });

      if (filteredOds.length === 0) {
        alert("No approved ODs found in this date range.");
        setGeneratingPdf(false);
        return;
      }

      const doc = new jsPDF('landscape');
      
      // Title
      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229);
      doc.text('Approved On-Duty Applications Report', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Period: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, 14, 28);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34);

      const tableData = filteredOds.map(od => {
        let dateStr = '';
        if (od.startDate) {
          dateStr = `${new Date(od.startDate).toLocaleDateString()} ${od.startTime} to ${new Date(od.endDate).toLocaleDateString()} ${od.endTime}`;
        } else {
          dateStr = new Date(od.date).toLocaleDateString();
        }

        return [
          od.studentRollNumber || 'N/A',
          od.studentName,
          dateStr,
          od.eventName,
          od.venue || 'N/A',
          od.description || od.reason
        ];
      });

      autoTable(doc, {
        startY: 42,
        head: [['Roll No.', 'Student Name', 'Date & Time', 'Event Name', 'Venue', 'Description']],
        body: tableData,
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 55 },
          3: { cellWidth: 40 },
          4: { cellWidth: 30 },
          5: { cellWidth: 'auto' },
        },
        theme: 'grid'
      });

      doc.save(`Approved_ODs_${fromDate}_to_${toDate}.pdf`);

    } catch (err) {
      alert("Error generating PDF: " + err.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) return <div className="container fade-in">Loading students...</div>;
  if (error) return <div className="container fade-in" style={{color: 'var(--danger)'}}><strong>Error:</strong> {error}</div>;

  return (
    <div className="container fade-in">
      <h1 className="page-title">Student Tracking</h1>
      <p className="page-subtitle">Monitor student engagement, approved ODs, and achievements</p>

      {/* PDF Generation Card */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1.5rem', background: 'var(--primary-light)', border: '1px solid #c7d2fe' }}>
        <div style={{ flex: '1 1 100%' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={20} /> Download OD Report
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-hover)' }}>Generate a PDF of approved ODs for your assigned students sorted by roll number.</p>
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-color)' }}>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-color)' }}>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }} />
        </div>
        
        <button onClick={generatePDF} disabled={generatingPdf} className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>
          {generatingPdf ? 'Generating...' : 'Generate PDF'}
        </button>
      </div>

      <div className="card">
        {students.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No students registered.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Approved ODs</th>
                <th>Achievements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td style={{ fontWeight: 600 }}>{student.rollNumber || 'N/A'}</td>
                  <td style={{ fontWeight: 500 }}>{student.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                  <td>
                    <span style={{ fontWeight: 500, color: student.approvedOdsCount > 5 ? 'var(--danger)' : 'inherit' }}>
                      {student.approvedOdsCount}
                    </span>
                  </td>
                  <td>
                     {student.achievementsCount}
                  </td>
                  <td>
                    <button onClick={() => fetchStudentDetails(student)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedStudent.name}</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Roll No: {selectedStudent.rollNumber || 'N/A'} | {selectedStudent.email}</span>
              </div>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            {loadingDetails ? (
              <p>Loading records...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                
                {/* ODs Section */}
                <section>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} /> Approved ODs
                  </h3>
                  {studentOds.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No approved ODs found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {studentOds.map(od => (
                        <div key={od._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', background: '#f8fafc' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{od.eventName}</strong>
                            {od.venue && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {od.venue}</span>}
                          </div>
                          
                          {od.startDate ? (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              {new Date(od.startDate).toLocaleDateString()} {od.startTime} - {new Date(od.endDate).toLocaleDateString()} {od.endTime}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              {new Date(od.date).toLocaleDateString()}
                            </div>
                          )}

                          <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.4 }}>{od.description || od.reason}</p>
                          {od.proofLink && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <a href={od.proofLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'underline' }}>View Proof</a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Achievements Section */}
                <section>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🏆 Recorded Achievements
                  </h3>
                  {studentAchievements.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No achievements recorded.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {studentAchievements.map(ach => (
                        <div key={ach._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', background: '#fbf5ff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: 'var(--secondary-dark)' }}>{ach.eventName}</strong>
                            <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{ach.rank}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.4, marginBottom: '0.5rem' }}>{ach.description}</p>
                          <small style={{ color: 'var(--text-muted)' }}>
                            📅 {new Date(ach.date).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTracking;
