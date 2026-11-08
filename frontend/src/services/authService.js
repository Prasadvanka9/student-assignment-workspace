import API from './api';

export const registerStudent = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return response.data;
};

export const loginStudent = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const getCurrentStudent = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

