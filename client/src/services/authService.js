import axios from 'axios';

const API_URL = '/api/auth/register';

const register = (username, password) => {
  return axios.post(`${API_URL}register`, { username, password });
};

const login = (username, password) => {
  return axios.post(`${API_URL}login`, { username, password });
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return axios.get(`${API_URL}me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return null;
};

const logout = () => {
  localStorage.removeItem('token');
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
};