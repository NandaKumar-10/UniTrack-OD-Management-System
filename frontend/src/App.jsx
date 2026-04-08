import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import ODApplications from './pages/student/ODApplications';
import Achievements from './pages/student/Achievements';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyApprovals from './pages/faculty/FacultyApprovals';
import StudentTracking from './pages/faculty/StudentTracking';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminReports from './pages/admin/AdminReports';
import AdminStudents from './pages/admin/AdminStudents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/student" element={<Layout role="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="od" element={<ODApplications />} />
          <Route path="achievements" element={<Achievements />} />
        </Route>
        
        <Route path="/faculty" element={<Layout role="faculty" />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="approvals" element={<FacultyApprovals />} />
          <Route path="students" element={<StudentTracking />} />
        </Route>
        
        <Route path="/admin" element={<Layout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
