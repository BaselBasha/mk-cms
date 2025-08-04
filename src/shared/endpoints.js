// Centralized API endpoints for backend communication

export const API_BASE_URL = "http://localhost:5000"; // Change to your backend base URL

export const ENDPOINTS = {
  awards: `${API_BASE_URL}/api/awards`,
  careers: `${API_BASE_URL}/api/careers`,
  certifications: `${API_BASE_URL}/api/certifications`,
  news: `${API_BASE_URL}/api/news`,
  partnerships: `${API_BASE_URL}/api/partnerships`,
  projects: `${API_BASE_URL}/api/projects`,
  press: `${API_BASE_URL}/api/press`,
  auth: `${API_BASE_URL}/api/auth`,
  upload: `${API_BASE_URL}/api/upload`,
}; 