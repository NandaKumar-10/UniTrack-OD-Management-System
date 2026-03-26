import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card fade-in" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <GraduationCap size={64} />
        </div>
        <h1 className="page-title">Welcome to UniTrack</h1>
        <p className="page-subtitle">University Student Activity Tracking & Department Engagement</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem' }}>
          <button className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.1rem' }} onClick={() => navigate('/student')}>
            <GraduationCap size={24} style={{ color: 'var(--primary)' }} />
            Login as Student
          </button>
          
          <button className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.1rem' }} onClick={() => navigate('/faculty')}>
            <Users size={24} style={{ color: 'var(--secondary)' }} />
            Login as Faculty / In-Charge
          </button>
          
          <button className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.1rem' }} onClick={() => navigate('/admin')}>
            <Shield size={24} style={{ color: 'var(--danger)' }} />
            Login as Administrator
          </button>
        </div>
        
        <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Basic Frontend Demonstration Version
        </div>
      </div>
    </div>
  );
};

export default Login;
