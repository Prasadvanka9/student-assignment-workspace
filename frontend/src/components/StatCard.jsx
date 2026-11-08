import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, colorVariant = 'blue', progress = null }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {subtext && <span className="stat-subtext">{subtext}</span>}
        {progress !== null && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper stat-icon-${colorVariant}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;

