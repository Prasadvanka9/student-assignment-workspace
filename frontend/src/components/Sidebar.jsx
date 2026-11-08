import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarClock,
  FolderKanban,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, counts = {} }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinks = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      to: '/assignments',
      label: 'All Assignments',
      icon: BookOpen,
      badge: counts.total || null
    },
    {
      to: '/deadlines',
      label: 'Deadline Tracker',
      icon: CalendarClock,
      badge: counts.overdue > 0 ? `${counts.overdue} overdue` : null,
      badgeVariant: counts.overdue > 0 ? 'overdue' : null
    },
    {
      to: '/subjects',
      label: 'Subjects',
      icon: FolderKanban
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 39 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <h1>Assignment Hub</h1>
            <p>Student Workspace</p>
          </div>
          <button
            type="button"
            className="btn-icon mobile-menu-btn"
            style={{ marginLeft: 'auto' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Navigation</span>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className="nav-badge"
                    style={
                      link.badgeVariant === 'overdue'
                        ? { backgroundColor: '#fee2e2', color: '#b91c1c' }
                        : {}
                    }
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <span className="nav-section-title" style={{ marginTop: '16px' }}>
            Quick Filters
          </span>
          <NavLink
            to="/assignments?status=Pending"
            onClick={onClose}
            className="nav-item"
          >
            <Clock size={17} color="var(--amber-600)" />
            <span>Pending</span>
            {counts.pending > 0 && (
              <span className="nav-badge">{counts.pending}</span>
            )}
          </NavLink>
          <NavLink
            to="/assignments?status=Completed"
            onClick={onClose}
            className="nav-item"
          >
            <CheckCircle size={17} color="var(--emerald-600)" />
            <span>Completed</span>
            {counts.completed > 0 && (
              <span className="nav-badge">{counts.completed}</span>
            )}
          </NavLink>
          <NavLink
            to="/assignments?status=Overdue"
            onClick={onClose}
            className="nav-item"
          >
            <AlertCircle size={17} color="var(--rose-600)" />
            <span>Overdue</span>
            {counts.overdue > 0 && (
              <span
                className="nav-badge"
                style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
              >
                {counts.overdue}
              </span>
            )}
          </NavLink>
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'Student'}</p>
              <p className="user-role">{user?.email || 'student@university.edu'}</p>
            </div>
            <button
              type="button"
              className="btn-icon"
              title="Sign Out"
              onClick={logout}
              style={{ color: 'var(--slate-500)' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

