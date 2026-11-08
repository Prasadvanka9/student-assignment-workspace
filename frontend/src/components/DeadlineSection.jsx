import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import AssignmentCard from './AssignmentCard';

const DeadlineSection = ({
  assignments = [],
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Categorize
  const overdueList = [];
  const dueTodayList = [];
  const upcomingList = [];
  const completedList = [];

  assignments.forEach((item) => {
    const due = new Date(item.dueDate);

    if (item.status === 'Completed') {
      completedList.push(item);
    } else if (due < startOfToday) {
      overdueList.push(item);
    } else if (due >= startOfToday && due <= endOfToday) {
      dueTodayList.push(item);
    } else {
      upcomingList.push(item);
    }
  });

  // Sort by nearest deadline
  overdueList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  dueTodayList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  upcomingList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  completedList.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  const tabs = [
    {
      id: 'upcoming',
      label: 'Upcoming Deadlines',
      icon: Calendar,
      count: upcomingList.length,
      badgeColor: 'var(--primary-100)',
      textColor: 'var(--primary-700)',
      data: upcomingList
    },
    {
      id: 'today',
      label: 'Due Today',
      icon: Clock,
      count: dueTodayList.length,
      badgeColor: '#fef3c7',
      textColor: '#b45309',
      data: dueTodayList
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      count: overdueList.length,
      badgeColor: '#fee2e2',
      textColor: '#b91c1c',
      data: overdueList
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: completedList.length,
      badgeColor: '#dcfce7',
      textColor: '#15803d',
      data: completedList
    }
  ];

  const currentTabData = tabs.find((t) => t.id === activeTab)?.data || [];

  return (
    <div>
      {/* Deadline Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                border: isActive
                  ? '1px solid var(--border-subtle)'
                  : '1px solid transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                color: isActive ? 'var(--slate-900)' : 'var(--slate-600)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: tab.badgeColor,
                  color: tab.textColor,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Cards or Empty State for selected tab */}
      {currentTabData.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CalendarCheck size={28} />
          </div>
          <h3 className="empty-state-title">No assignments in this category</h3>
          <p className="empty-state-desc">
            {activeTab === 'overdue'
              ? 'Awesome! You have no overdue assignments.'
              : activeTab === 'today'
              ? 'Nothing due today! Enjoy your schedule.'
              : activeTab === 'upcoming'
              ? 'No upcoming assignments scheduled.'
              : 'You have not marked any assignments as completed yet.'}
          </p>
        </div>
      ) : (
        <div className="assignment-grid">
          {currentTabData.map((item) => (
            <AssignmentCard
              key={item._id}
              assignment={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeadlineSection;

