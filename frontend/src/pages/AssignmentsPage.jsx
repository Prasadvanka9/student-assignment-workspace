import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, BookOpen, Layers } from 'lucide-react';
import FilterSection from '../components/FilterSection';
import AssignmentList from '../components/AssignmentList';

const AssignmentsPage = ({
  assignments = [],
  loading = false,
  onOpenAddModal,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('deadline-asc');

  // Sync status filter from URL if present (e.g., from quick sidebar links)
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && ['Pending', 'In Progress', 'Completed', 'Overdue'].includes(urlStatus)) {
      setStatus(urlStatus);
    } else {
      setStatus('All');
    }
  }, [searchParams]);

  // Extract unique available subjects from existing assignments
  const availableSubjects = useMemo(() => {
    const set = new Set();
    assignments.forEach((a) => {
      if (a.subject) set.add(a.subject);
    });
    return Array.from(set).sort();
  }, [assignments]);

  // Handle category tab change
  const handleCategoryTabClick = (category) => {
    setStatus(category);
    if (category === 'All') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', category);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSubject('All');
    setPriority('All');
    setStatus('All');
    setSort('deadline-asc');
    searchParams.delete('status');
    setSearchParams(searchParams);
  };

  // Filter and sort assignments locally on the current dataset
  const filteredAssignments = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return assignments
      .filter((item) => {
        // Search filter (title, subject, description)
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(query);
          const matchSub = item.subject?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          if (!matchTitle && !matchSub && !matchDesc) return false;
        }

        // Subject filter
        if (subject !== 'All' && item.subject !== subject) {
          return false;
        }

        // Priority filter
        if (priority !== 'All' && item.priority !== priority) {
          return false;
        }

        // Status filter
        if (status !== 'All') {
          if (status === 'Overdue') {
            const isPast = new Date(item.dueDate) < startOfToday;
            if (!isPast || item.status === 'Completed') return false;
          } else if (item.status !== status) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === 'deadline-asc') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sort === 'deadline-desc') {
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sort === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sort === 'priority') {
          const weights = { High: 3, Medium: 2, Low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        return 0;
      });
  }, [assignments, search, subject, priority, status, sort]);

  const categoryTabs = [
    { label: 'All Assignments', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Overdue', value: 'Overdue' }
  ];

  return (
    <div>
      {/* Page Title & Add Button */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Assignment Management
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', marginTop: '2px' }}>
            Manage, organize, and monitor all your academic assignments in one place.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '18px'
        }}
      >
        {categoryTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleCategoryTabClick(tab.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.86rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? 'var(--primary-600)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--slate-600)',
                border: isActive ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                boxShadow: isActive ? '0 2px 6px rgba(37,99,235,0.25)' : 'var(--shadow-xs)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <FilterSection
        search={search}
        onSearchChange={setSearch}
        subject={subject}
        onSubjectChange={setSubject}
        availableSubjects={availableSubjects}
        priority={priority}
        onPriorityChange={setPriority}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        onResetFilters={handleResetFilters}
      />

      {/* Assignment List */}
      <AssignmentList
        assignments={filteredAssignments}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onAddNew={onOpenAddModal}
        emptyTitle="No matching assignments found"
        emptyMessage="Try adjusting your search criteria, subject filter, or create a new assignment."
      />
    </div>
  );
};

export default AssignmentsPage;

