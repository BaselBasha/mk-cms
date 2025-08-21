// Centralized API endpoints for backend communication

export const API_BASE_URL = "https://mk-cms-back.vercel.app"; // Backend deployment URL

export const ENDPOINTS = {
  awards: `${API_BASE_URL}/api/awards`,
  careers: `${API_BASE_URL}/api/careers`,
  certifications: `${API_BASE_URL}/api/certifications`,
  news: `${API_BASE_URL}/api/news`,
  partnerships: `${API_BASE_URL}/api/partnerships`,
  projects: `${API_BASE_URL}/api/projects`,
  press: `${API_BASE_URL}/api/press`,
  companies: `${API_BASE_URL}/api/companies`,
  auth: `${API_BASE_URL}/api/auth`,
  upload: `${API_BASE_URL}/api/upload`,
  candidates: `${API_BASE_URL}/api/candidates`,
};

// Helper function to get endpoint with language parameter
export const getEndpointWithLang = (endpoint, language = 'en') => {
  return `${endpoint}?lang=${language}`;
};

// Helper function to get endpoint with language header
export const getEndpointWithLangHeader = (endpoint) => {
  return endpoint;
}; 