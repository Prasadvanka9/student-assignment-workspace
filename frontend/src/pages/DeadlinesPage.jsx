import React from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import DeadlineSection from '../components/DeadlineSection';

const DeadlinesPage = ({
  assignments = [],
  loading = false,
  onOpenAddModal,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarClock size={24} color="var(--primary-600)" />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Deadline Tracker
            </h1>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', marginTop: '4px' }}>
            Track time-sensitive tasks, prioritize due dates, and prevent overdue coursework submissions.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Deadline Section */}
      <DeadlineSection
        assignments={assignments}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default DeadlinesPage;

