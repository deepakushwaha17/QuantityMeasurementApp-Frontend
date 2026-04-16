import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT + user headers ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qma_token');
    const userRaw = localStorage.getItem('qma_user');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        // X-Username header — used by Quantity Service
        if (user.username) config.headers['X-Username'] = user.username;
        // X-User-Id header — used by Quantity Service
        if (user.id !== null && user.id !== undefined) {
          config.headers['X-User-Id'] = String(user.id);
        }
      } catch { /* ignore */ }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 → auto logout ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qma_token');
      localStorage.removeItem('qma_user');
      window.dispatchEvent(new CustomEvent('qma:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth APIs ───────────────────────────────────────────────────────────────
// AuthController is at /auth/* on the API Gateway
// POST /auth/login  → { usernameOrEmail, password }
//   response: { success, message, token, username, email }
// POST /auth/register → { username, email, password }
//   response: { success, message, username, email }  (NO token)
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getGoogleLoginUrl: () => `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`,
};

// ── Quantity APIs ────────────────────────────────────────────────────────────
// All routes: POST /api/v1/quantities/{operation}
// Request body matches QuantityInputDTO exactly (see below)
// Headers required: Authorization, X-Username, X-User-Id
//
// QuantityInputDTO fields (all operations share the same DTO):
//   value1        Double   — first value (required for all)
//   unit1         String   — unit of value1 (required for all)
//   value2        Double   — second value (add, subtract, compare, addWithTarget, subtractWithTarget)
//   unit2         String   — unit of value2 (add, subtract, compare, addWithTarget, subtractWithTarget)
//   targetUnit    String   — target unit for convert, addWithTarget, subtractWithTarget
//   factor        Double   — multiplier/divisor for multiply, divide
//   quantityType  String   — LENGTH / WEIGHT / VOLUME / TEMPERATURE
export const quantityAPI = {
  convert:             (data) => api.post('/api/v1/quantities/convert', data),
  compare:             (data) => api.post('/api/v1/quantities/compare', data),
  add:                 (data) => api.post('/api/v1/quantities/add', data),
  addWithTarget:       (data) => api.post('/api/v1/quantities/add-with-target', data),
  subtract:            (data) => api.post('/api/v1/quantities/subtract', data),
  subtractWithTarget:  (data) => api.post('/api/v1/quantities/subtract-with-target', data),
  multiply:            (data) => api.post('/api/v1/quantities/multiply', data),
  divide:              (data) => api.post('/api/v1/quantities/divide', data),
  getHistory:          () => api.get('/api/v1/quantities/history'),
  getHistoryByOperation: (op) => api.get(`/api/v1/quantities/history/operation/${op}`),
};
