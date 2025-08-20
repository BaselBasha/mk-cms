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

// Helper function to get current language
const getCurrentLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

// Generic API request function with language support
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const language = getCurrentLanguage();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
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

// Stats API functions with language support
export const fetchDashboardStats = async () => {
  try {
    const [projects, certifications, partnerships, awards, careers, companies] = await Promise.allSettled([
      apiRequest('/projects/stats/admin'),
      apiRequest('/certifications/stats/admin'),
      apiRequest('/partnerships/stats/admin'),
      apiRequest('/awards/stats/admin'),
      apiRequest('/careers/stats/admin'),
      apiRequest('/companies/stats/admin'),
    ]);

    return {
      projects: projects.status === 'fulfilled' ? projects.value : { total: 0, thisMonth: 0 },
      certifications: certifications.status === 'fulfilled' ? certifications.value : { total: 0, thisMonth: 0 },
      partnerships: partnerships.status === 'fulfilled' ? partnerships.value : { total: 0, thisMonth: 0 },
      awards: awards.status === 'fulfilled' ? awards.value : { total: 0, thisMonth: 0 },
      careers: careers.status === 'fulfilled' ? careers.value : { total: 0, thisMonth: 0 },
      companies: companies.status === 'fulfilled' ? companies.value : { total: 0, thisMonth: 0 },
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
      companies: { total: 0, thisMonth: 0 },
    };
  }
};

// Generic CRUD functions with language support
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => {
    const language = getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: language }),
    });
  },
  put: (endpoint, data) => {
    const language = getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: language }),
    });
  },
  patch: (endpoint, data) => {
    const language = getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ ...data, lang: language }),
    });
  },
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
};

// Language-aware API functions
export const languageApi = {
  get: (endpoint, language) => {
    const lang = language || getCurrentLanguage();
    return apiRequest(`${endpoint}?lang=${lang}`);
  },
  post: (endpoint, data, language) => {
    const lang = language || getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ ...data, lang }),
    });
  },
  put: (endpoint, data, language) => {
    const lang = language || getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang }),
    });
  },
  patch: (endpoint, data, language) => {
    const lang = language || getCurrentLanguage();
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ ...data, lang }),
    });
  },
  delete: (endpoint, language) => {
    const lang = language || getCurrentLanguage();
    return apiRequest(`${endpoint}?lang=${lang}`, {
      method: 'DELETE',
    });
  },
}; 