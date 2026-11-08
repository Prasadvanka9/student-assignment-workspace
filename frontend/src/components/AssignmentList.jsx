import React from 'react';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

const AssignmentList = ({
  assignments = [],
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNew,
  emptyTitle = 'No assignments found',
  emptyMessage = 'Get started by creating your first academic assignment or adjusting your search filters.'
}) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 0',
          gap: '12px',
          color: 'var(--slate-500)'
        }}
      >
        <Loader2 size={32} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Loading assignments...</p>
        <style>{`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <BookOpen size={30} />
        </div>
        <h3 className="empty-state-title">{emptyTitle}</h3>
        <p className="empty-state-desc">{emptyMessage}</p>
        {onAddNew && (
          <button type="button" className="btn btn-primary" onClick={onAddNew}>
            <Plus size={16} />
            <span>Create Assignment</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="assignment-grid">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment._id}
          assignment={assignment}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default AssignmentList;

