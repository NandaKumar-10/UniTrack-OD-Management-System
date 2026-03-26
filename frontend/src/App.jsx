import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/student" element={<Layout role="student" />}>
          <Route index element={<StudentDashboard />} />
        </Route>
        
        <Route path="/faculty" element={<Layout role="faculty" />}>
          <Route index element={<FacultyDashboard />} />
        </Route>
        
        <Route path="/admin" element={<Layout role="admin" />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
