export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  useMockData: (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') === 'true',
  userRole: (import.meta.env.VITE_USER_ROLE || 'admin') as 'admin' | 'user' | 'viewer',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

