import { useState, useEffect, useCallback } from 'react';
import {
  fetchAssignments,
  fetchAssignmentStats,
  createAssignment as apiCreate,
  updateAssignment as apiUpdate,
  deleteAssignment as apiDelete,
  updateAssignmentStatus as apiUpdateStatus
} from '../services/assignmentService';
import { useAuth } from '../context/AuthContext';

export const useAssignments = () => {
  const { isAuthenticated, showToast } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all assignments and real-time database stats
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const [assignmentsRes, statsRes] = await Promise.all([
        fetchAssignments(),
        fetchAssignmentStats()
      ]);

      if (assignmentsRes.success) {
        setAssignments(assignmentsRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data || {});
      }
    } catch (err) {
      console.error('Failed to load assignments or stats:', err);
      showToast('Error syncing assignments with server', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setAssignments([]);
    }
  }, [isAuthenticated, refreshData]);

  // Create Assignment
  const addAssignment = async (payload) => {
    try {
      setActionLoading(true);
      const res = await apiCreate(payload);
      if (res.success) {
        showToast('Assignment created successfully!', 'success');
        await refreshData();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create assignment', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Update Assignment
  const editAssignment = async (id, payload) => {
    try {
      setActionLoading(true);
      const res = await apiUpdate(id, payload);
      if (res.success) {
        showToast('Assignment updated successfully!', 'success');
        await refreshData();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update assignment', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Assignment
  const removeAssignment = async (id) => {
    try {
      setActionLoading(true);
      const res = await apiDelete(id);
      if (res.success) {
        showToast('Assignment removed successfully', 'success');
        await refreshData();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete assignment', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Change Status
  const changeStatus = async (id, status) => {
    try {
      // Optimistic update for snappy UI
      setAssignments((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );

      const res = await apiUpdateStatus(id, status);
      if (res.success) {
        showToast(`Status updated to "${status}"`, 'success');
        // Refresh server stats in background
        const statsRes = await fetchAssignmentStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
      await refreshData();
    }
  };

  return {
    assignments,
    stats,
    loading,
    actionLoading,
    refreshData,
    addAssignment,
    editAssignment,
    removeAssignment,
    changeStatus
  };
};

