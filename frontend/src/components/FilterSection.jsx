import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import SearchBar from './SearchBar';

const FilterSection = ({
  search,
  onSearchChange,
  subject,
  onSubjectChange,
  availableSubjects = [],
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onResetFilters
}) => {
  const hasActiveFilters =
    search !== '' ||
    subject !== 'All' ||
    priority !== 'All' ||
    status !== 'All' ||
    sort !== 'deadline-asc';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <SearchBar value={search} onChange={onSearchChange} />

      {/* Filter and Sort Dropdowns */}
      <div className="filter-actions">
        {/* Subject Filter */}
        <select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="filter-select"
          title="Filter by Subject"
        >
          <option value="All">All Subjects</option>
          {availableSubjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
          title="Filter by Priority"
        >
          <option value="All">All Priorities</option>
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🔵 Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
          title="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">⏳ Pending</option>
          <option value="In Progress">⚡ In Progress</option>
          <option value="Completed">✅ Completed</option>
          <option value="Overdue">🚨 Overdue</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
          title="Sort By"
        >
          <option value="deadline-asc">⏳ Nearest Deadline</option>
          <option value="deadline-desc">📅 Furthest Deadline</option>
          <option value="newest">✨ Newest Created</option>
          <option value="priority">🔥 Highest Priority</option>
        </select>

        {/* Reset button if filters are active */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
            title="Reset All Filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;

