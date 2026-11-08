import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar, pageTitle = 'Dashboard', onOpenAddModal }) => {
  const { user } = useAuth();

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="breadcrumb-title">{pageTitle}</h2>
      </div>

      <div className="navbar-right">
        <div className="current-date-badge">
          <Calendar size={15} />
          <span>{todayFormatted}</span>
        </div>

        {onOpenAddModal && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>New Assignment</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

