import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Trophy, Users, FileText, LogOut, GraduationCap } from 'lucide-react';

const Layout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const menuConfig = {
    student: [
      { path: '/student', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/student/od', icon: <Calendar size={20} />, label: 'My OD Applications' },
      { path: '/student/achievements', icon: <Trophy size={20} />, label: 'Achievements' },
    ],
    faculty: [
      { path: '/faculty', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/faculty/approvals', icon: <FileText size={20} />, label: 'OD Approvals' },
      { path: '/faculty/students', icon: <Users size={20} />, label: 'Student Tracking' },
    ],
    admin: [
      { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
      { path: '/admin/events', icon: <Calendar size={20} />, label: 'Event Publishing' },
      { path: '/admin/reports', icon: <FileText size={20} />, label: 'Monthly Summary' },
    ]
  };

  const navItems = menuConfig[role] || [];

  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <GraduationCap size={28} />
          <span>UniTrack</span>
        </div>
        <nav className="nav-links">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === `/${role}`}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <div style={{ flex: 1 }} />
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', color: 'var(--danger)' }}>
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{roleDisplay} Portal</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="badge badge-info">{roleDisplay}</div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              U
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
