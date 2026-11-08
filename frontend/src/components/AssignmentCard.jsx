import React from 'react';
import { Calendar, Edit3, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const AssignmentCard = ({
  assignment,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const { _id, title, subject, description, dueDate, priority, status } = assignment;

  // Deadline calculation
  const now = new Date();
  const due = new Date(dueDate);

  // Normalize to date-only comparisons (ignoring milliseconds)
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffTime = dueDateOnly.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0 && status !== 'Completed';
  const isDueToday = diffDays === 0 && status !== 'Completed';
  const isCompleted = status === 'Completed';

  // Format Due Text
  const formatDeadlineText = () => {
    const formattedDate = due.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (isCompleted) {
      return `Completed (${formattedDate})`;
    }
    if (diffDays < 0) {
      const days = Math.abs(diffDays);
      return `Overdue by ${days} ${days === 1 ? 'day' : 'days'} (${formattedDate})`;
    }
    if (diffDays === 0) {
      return `Due Today! (${formattedDate})`;
    }
    if (diffDays === 1) {
      return `Due Tomorrow (${formattedDate})`;
    }
    return `Due in ${diffDays} days (${formattedDate})`;
  };

  const getCardModifierClass = () => {
    if (isCompleted) return 'is-completed';
    if (isOverdue) return 'is-overdue';
    if (isDueToday) return 'is-due-today';
    return '';
  };

  const handleToggleComplete = () => {
    const nextStatus = status === 'Completed' ? 'Pending' : 'Completed';
    onStatusChange(_id, nextStatus);
  };

  return (
    <div className={`assignment-card ${getCardModifierClass()}`}>
      <div>
        <div className="card-top">
          <span className="badge-subject">{subject}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <PriorityBadge priority={priority} />
            <StatusBadge status={status} isOverdue={isOverdue} />
          </div>
        </div>

        <h3 className="assignment-title" title={title}>
          {title}
        </h3>

        {description && (
          <p className="assignment-description" title={description}>
            {description}
          </p>
        )}
      </div>

      <div>
        <div className="card-meta">
          <div
            className={`due-indicator ${
              isOverdue ? 'overdue' : isDueToday ? 'today' : ''
            }`}
          >
            {isOverdue ? (
              <AlertCircle size={14} />
            ) : isDueToday ? (
              <Clock size={14} />
            ) : (
              <Calendar size={14} />
            )}
            <span>{formatDeadlineText()}</span>
          </div>
        </div>

        <div className="card-bottom">
          <button
            type="button"
            className={`btn btn-sm ${
              isCompleted ? 'btn-secondary' : 'btn-primary'
            }`}
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Check size={14} />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>

          <div className="card-actions">
            <select
              value={status}
              onChange={(e) => onStatusChange(_id, e.target.value)}
              className="filter-select"
              style={{ fontSize: '0.78rem', padding: '5px 8px' }}
              title="Change Status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              type="button"
              className="btn-icon"
              onClick={() => onEdit(assignment)}
              title="Edit Assignment"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              className="btn-icon"
              style={{ color: 'var(--rose-600)' }}
              onClick={() => onDelete(assignment)}
              title="Delete Assignment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;

