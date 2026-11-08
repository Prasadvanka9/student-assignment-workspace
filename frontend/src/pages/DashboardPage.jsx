import React from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import AssignmentCard from '../components/AssignmentCard';

const DashboardPage = ({
  stats,
  assignments,
  loading,
  onOpenAddModal,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const { user } = useAuth();

  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const inProgress = stats?.inProgress || 0;
  const completed = stats?.completed || 0;
  const overdue = stats?.overdue || 0;
  const completionRate = stats?.completionRate || 0;

  // Filter upcoming (not completed, sorted by due date)
  const now = new Date();
  const upcomingDeadlines = assignments
    .filter((a) => a.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Recent assignments
  const recentAssignments = assignments
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div>
      {/* Welcome Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          marginBottom: '28px',
          padding: '28px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#93c5fd',
              marginBottom: '6px',
              display: 'block'
            }}
          >
            Academic Overview
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.92rem',
              marginTop: '6px',
              maxWidth: '560px'
            }}
          >
            {overdue > 0
              ? `You have ${overdue} overdue ${overdue === 1 ? 'assignment' : 'assignments'} that need attention. Stay organized and crush your deadlines!`
              : pending > 0
              ? `You have ${pending} pending assignments lined up. Keep up the great pace!`
              : 'All caught up! Excellent work maintaining your academic milestones.'}
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={onOpenAddModal}
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Plus size={18} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Dynamic Database Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Assignments"
          value={total}
          subtext="Enrolled coursework"
          icon={BookOpen}
          colorVariant="blue"
        />

        <StatCard
          title="Pending"
          value={pending}
          subtext={`${inProgress} in progress`}
          icon={Clock}
          colorVariant="amber"
        />

        <StatCard
          title="Completed"
          value={completed}
          subtext="Successfully finished"
          icon={CheckCircle2}
          colorVariant="emerald"
        />

        <StatCard
          title="Overdue"
          value={overdue}
          subtext="Requires immediate action"
          icon={AlertCircle}
          colorVariant="rose"
        />

        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtext={`${completed} of ${total} finished`}
          icon={TrendingUp}
          colorVariant="indigo"
          progress={completionRate}
        />
      </div>

      {/* Main Dashboard Two-Column Sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginTop: '8px'
        }}
      >
        {/* Upcoming Deadlines Column */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary-600)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Upcoming Deadlines
              </h2>
            </div>
            <Link
              to="/deadlines"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View tracker</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <CheckCircle2 size={36} color="var(--emerald-600)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontWeight: 700, color: 'var(--slate-800)', marginBottom: '4px' }}>
                No Pending Deadlines
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)' }}>
                You have completed all scheduled assignments or have none pending.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingDeadlines.map((item) => (
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

        {/* Recent Assignments Column */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--indigo-600)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Recent Assignments
              </h2>
            </div>
            <Link
              to="/assignments"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentAssignments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
              <BookOpen size={36} color="var(--slate-400)" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontWeight: 700, color: 'var(--slate-800)', marginBottom: '4px' }}>
                No Assignments Yet
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)', marginBottom: '14px' }}>
                Add your first assignment to begin tracking coursework.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenAddModal}
              >
                <Plus size={14} />
                <span>Add Assignment</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentAssignments.map((item) => (
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
      </div>
    </div>
  );
};

export default DashboardPage;

