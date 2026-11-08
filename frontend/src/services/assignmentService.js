import API from './api';

export const fetchAssignments = async (params = {}) => {
  const response = await API.get('/assignments', { params });
  return response.data;
};

export const fetchAssignmentStats = async () => {
  const response = await API.get('/assignments/stats/summary');
  return response.data;
};

export const fetchAssignmentById = async (id) => {
  const response = await API.get(`/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await API.post('/assignments', data);
  return response.data;
};

export const updateAssignment = async (id, data) => {
  const response = await API.put(`/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await API.delete(`/assignments/${id}`);
  return response.data;
};

export const updateAssignmentStatus = async (id, status) => {
  const response = await API.patch(`/assignments/${id}/status`, { status });
  return response.data;
};

