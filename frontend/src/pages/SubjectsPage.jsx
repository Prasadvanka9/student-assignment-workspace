import React, { useState } from 'react';
import {
  FolderKanban,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '../components/AssignmentCard';

const DEFAULT_SUBJECTS = [
  'React.js',
  'JavaScript',
  'Data Analytics',
  'Computer Networks',
  'Machine Learning',
  'Operating Systems'
];

const SubjectsPage = ({
  assignments = [],
  onOpenAddModal,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Group assignments by subject
  const subjectMap = {};

  // First populate with default subjects
  DEFAULT_SUBJECTS.forEach((sub) => {
    subjectMap[sub] = [];
  });

  // Then add all assignments
  assignments.forEach((item) => {
    const sub = item.subject || 'General';
    if (!subjectMap[sub]) {
      subjectMap[sub] = [];
    }
    subjectMap[sub].push(item);
  });

  const subjectNames = Object.keys(subjectMap).sort();

  const handleSelectSubject = (sub) => {
    setSelectedSubject(selectedSubject === sub ? null : sub);
  };

  const handleViewInAssignments = (sub) => {
    navigate(`/assignments?subject=${encodeURIComponent(sub)}`);
  };

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
            <FolderKanban size={24} color="var(--indigo-600)" />
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Subject Management
            </h1>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', marginTop: '4px' }}>
            Organize coursework by curriculum subjects, monitor syllabus completion, and stay focused.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >
        {subjectNames.map((sub) => {
          const items = subjectMap[sub];
          const total = items.length;
          const completed = items.filter((i) => i.status === 'Completed').length;
          const pending = items.filter((i) => i.status !== 'Completed').length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isSelected = selectedSubject === sub;

          return (
            <div
              key={sub}
              className="card"
              onClick={() => handleSelectSubject(sub)}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary-600)' : 'var(--border-subtle)',
                boxShadow: isSelected ? '0 0 0 2px var(--primary-500), var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <span
                  style={{
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Course Module
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  {total} {total === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--slate-900)',
                  marginBottom: '10px'
                }}
              >
                {sub}
              </h3>

              {/* Progress */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--slate-500)',
                    marginBottom: '4px'
                  }}
                >
                  <span>Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{percentage}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${percentage}%` }} />
                </div>
              </div>

              {/* Stats badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--slate-600)',
                  borderTop: '1px solid var(--slate-100)',
                  paddingTop: '10px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="var(--amber-600)" />
                  <span>{pending} pending</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} color="var(--emerald-600)" />
                  <span>{completed} done</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Subject Breakdown */}
      {selectedSubject && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Assignments in {selectedSubject}
              </h2>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.86rem' }}>
                Showing all coursework tasks tagged with {selectedSubject}.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedSubject(null)}
            >
              Clear Subject Selection
            </button>
          </div>

          {subjectMap[selectedSubject].length === 0 ? (
            <div className="empty-state">
              <BookOpen size={30} style={{ color: 'var(--slate-400)', marginBottom: '10px' }} />
              <h4 style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                No assignments for {selectedSubject} yet
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)', marginBottom: '14px' }}>
                Create an assignment and categorize it under {selectedSubject}.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenAddModal}
              >
                <Plus size={14} />
                <span>Add Assignment for {selectedSubject}</span>
              </button>
            </div>
          ) : (
            <div className="assignment-grid">
              {subjectMap[selectedSubject].map((item) => (
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
      )}
    </div>
  );
};

export default SubjectsPage;

