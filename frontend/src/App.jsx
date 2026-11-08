import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useAssignments } from './hooks/useAssignments';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AssignmentForm from './components/AssignmentForm';
import DeleteModal from './components/DeleteModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import AssignmentsPage from './pages/AssignmentsPage';
import DeadlinesPage from './pages/DeadlinesPage';
import SubjectsPage from './pages/SubjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { isAuthenticated, loading: authLoading, toasts, removeToast } = useAuth();
  const location = useLocation();

  // Responsive Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form Modal State (Add / Edit)
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // Assignment data & actions hook
  const {
    assignments,
    stats,
    loading: assignmentsLoading,
    actionLoading,
    addAssignment,
    editAssignment,
    removeAssignment,
    changeStatus
  } = useAssignments();

  // Handlers for Form Modal
  const handleOpenAddModal = () => {
    setEditingAssignment(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setEditingAssignment(null);
  };

  const handleFormSubmit = async (formData) => {
    let success = false;
    if (editingAssignment) {
      success = await editAssignment(editingAssignment._id, formData);
    } else {
      success = await addAssignment(formData);
    }

    if (success) {
      handleCloseFormModal();
    }
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setAssignmentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;
    const success = await removeAssignment(assignmentToDelete._id);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  // Determine current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/assignments':
        return 'All Assignments';
      case '/deadlines':
        return 'Deadline Tracker';
      case '/subjects':
        return 'Subjects Overview';
      default:
        return 'Student Workspace';
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app)',
          fontFamily: 'var(--font-family)',
          color: 'var(--slate-600)',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        Initializing Student Workspace...
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-container">
          {/* Collapsible/Responsive Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            counts={{
              total: stats.total,
              pending: stats.pending,
              completed: stats.completed,
              overdue: stats.overdue
            }}
          />

          <div className="main-wrapper">
            {/* Top Navbar */}
            <Navbar
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              pageTitle={getPageTitle()}
              onOpenAddModal={handleOpenAddModal}
            />

            {/* Page Views Content */}
            <main className="page-content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <DashboardPage
                      stats={stats}
                      assignments={assignments}
                      loading={assignmentsLoading}
                      onOpenAddModal={handleOpenAddModal}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onStatusChange={changeStatus}
                    />
                  }
                />
                <Route
                  path="/assignments"
                  element={
                    <AssignmentsPage
                      assignments={assignments}
                      loading={assignmentsLoading}
                      onOpenAddModal={handleOpenAddModal}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onStatusChange={changeStatus}
                    />
                  }
                />
                <Route
                  path="/deadlines"
                  element={
                    <DeadlinesPage
                      assignments={assignments}
                      loading={assignmentsLoading}
                      onOpenAddModal={handleOpenAddModal}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onStatusChange={changeStatus}
                    />
                  }
                />
                <Route
                  path="/subjects"
                  element={
                    <SubjectsPage
                      assignments={assignments}
                      onOpenAddModal={handleOpenAddModal}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onStatusChange={changeStatus}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Create / Edit Modal */}
          <AssignmentForm
            isOpen={formModalOpen}
            initialData={editingAssignment}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseFormModal}
            loading={actionLoading}
          />

          {/* Delete Confirmation Modal */}
          <DeleteModal
            isOpen={deleteModalOpen}
            title="Delete Assignment"
            message={`Are you sure you want to permanently delete "${assignmentToDelete?.title}"? This cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDeleteModal}
            loading={actionLoading}
          />
        </div>
      )}
    </>
  );
}

export default App;

