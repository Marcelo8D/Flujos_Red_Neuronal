import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials: any) => api.post('/api/auth/login', credentials),
  register: (userData: any) => api.post('/api/auth/register', userData),
  me: () => api.get('/api/auth/me'),
};

export const modelsAPI = {
  upload: (formData: FormData) => api.post('/api/models/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: () => api.get('/api/models'),
  getById: (id: number) => api.get(`/api/models/${id}`),
  delete: (id: number) => api.delete(`/api/models/${id}`),
};

export const projectsAPI = {
  create: (data: any) => api.post('/api/projects', data),
  list: () => api.get('/api/projects'),
  getById: (id: number) => api.get(`/api/projects/${id}`),
  update: (id: number, data: any) => api.put(`/api/projects/${id}`, data),
  delete: (id: number) => api.delete(`/api/projects/${id}`),
};