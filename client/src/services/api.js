const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

/**
 * Base fetch wrapper with error handling and JSON parsing.
 * Automatically includes credentials (cookies).
 */
async function request(url, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE}${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// --- Auth Service ---
export const authService = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
};

// --- Institute Service ---
export const instituteService = {
  create: (body) => request('/institutes', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => request('/institutes'),
  getById: (id) => request(`/institutes/${id}`),
  join: (code) => request('/institutes/join', { method: 'POST', body: JSON.stringify({ code }) }),
  getClassrooms: (id) => request(`/institutes/${id}/classrooms`),
};

// --- Classroom Service ---
export const classroomService = {
  create: (body) => request('/classrooms', { method: 'POST', body: JSON.stringify(body) }),
  getById: (id) => request(`/classrooms/${id}`),
  join: (id) => request(`/classrooms/${id}/join`, { method: 'POST' }),
  getSessions: (id, page = 1, limit = 10) =>
    request(`/classrooms/${id}/sessions?page=${page}&limit=${limit}`),
};

// --- Session Service ---
export const sessionService = {
  start: (classroomId) =>
    request('/sessions/start', { method: 'POST', body: JSON.stringify({ classroomId }) }),
  getById: (id) => request(`/sessions/${id}`),
  end: (id) => request(`/sessions/${id}/end`, { method: 'POST' }),
  getReport: (id) => request(`/sessions/${id}/report`),
};

// --- Pulse Service ---
export const pulseService = {
  getTemplates: () => request('/pulses/templates'),
};
