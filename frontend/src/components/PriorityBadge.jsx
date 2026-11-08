import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

const PriorityBadge = ({ priority = 'Medium' }) => {
  const getBadgeConfig = () => {
    switch (priority) {
      case 'High':
        return {
          className: 'badge-priority-high',
          icon: <AlertCircle size={13} />,
          label: 'High Priority'
        };
      case 'Medium':
        return {
          className: 'badge-priority-medium',
          icon: <AlertTriangle size={13} />,
          label: 'Medium'
        };
      case 'Low':
        return {
          className: 'badge-priority-low',
          icon: <ArrowDown size={13} />,
          label: 'Low'
        };
      default:
        return {
          className: 'badge-priority-medium',
          icon: <AlertTriangle size={13} />,
          label: priority
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

export default PriorityBadge;

