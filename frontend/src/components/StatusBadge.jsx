import React from 'react';
import { Clock, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';

const StatusBadge = ({ status = 'Pending', isOverdue = false }) => {
  // If explicitly overdue or marked
  if (status !== 'Completed' && isOverdue) {
    return (
      <span className="badge badge-status-overdue">
        <AlertOctagon size={13} />
        <span>Overdue</span>
      </span>
    );
  }

  const getBadgeConfig = () => {
    switch (status) {
      case 'Completed':
        return {
          className: 'badge-status-completed',
          icon: <CheckCircle2 size={13} />,
          label: 'Completed'
        };
      case 'In Progress':
        return {
          className: 'badge-status-in-progress',
          icon: <Loader2 size={13} />,
          label: 'In Progress'
        };
      case 'Pending':
      default:
        return {
          className: 'badge-status-pending',
          icon: <Clock size={13} />,
          label: 'Pending'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;

