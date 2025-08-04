const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const admin = localStorage.getItem('admin');
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        return adminData.token;
      } catch (error) {
        console.error('Error parsing admin data:', error);
        return null;
      }
    }
  }
  return null;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin');
          window.location.href = '/admin/login';
        }
        throw new Error('Authentication failed');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Stats API functions
export const fetchDashboardStats = async () => {
  try {
    const [projects, certifications, partnerships, awards, careers] = await Promise.allSettled([
      apiRequest('/projects/stats/admin'),
      apiRequest('/certifications/stats/admin'),
      apiRequest('/partnerships/stats/admin'),
      apiRequest('/awards/stats/admin'),
      apiRequest('/careers/stats/admin'),
    ]);

    return {
      projects: projects.status === 'fulfilled' ? projects.value : { total: 0, thisMonth: 0 },
      certifications: certifications.status === 'fulfilled' ? certifications.value : { total: 0, thisMonth: 0 },
      partnerships: partnerships.status === 'fulfilled' ? partnerships.value : { total: 0, thisMonth: 0 },
      awards: awards.status === 'fulfilled' ? awards.value : { total: 0, thisMonth: 0 },
      careers: careers.status === 'fulfilled' ? careers.value : { total: 0, thisMonth: 0 },
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    // Return default values if API fails
    return {
      projects: { total: 0, thisMonth: 0 },
      certifications: { total: 0, thisMonth: 0 },
      partnerships: { total: 0, thisMonth: 0 },
      awards: { total: 0, thisMonth: 0 },
      careers: { total: 0, thisMonth: 0 },
    };
  }
};

// Generic CRUD functions
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
}; 