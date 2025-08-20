import { ENDPOINTS } from './endpoints';

// Language-aware API service
class LanguageApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  // Get current language from localStorage
  getCurrentLanguage() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  }

  // Get auth token
  getAuthToken() {
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
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    const language = this.getCurrentLanguage();

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
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
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
  }

  // Awards API
  awards = {
    getAll: () => this.request('/awards'),
    getOne: (id) => this.request(`/awards/${id}`),
    create: (data) => this.request('/awards', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/awards/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/awards/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/awards/stats/admin'),
  };

  // Projects API
  projects = {
    getAll: () => this.request('/projects'),
    getOne: (id) => this.request(`/projects/${id}`),
    create: (data) => this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/projects/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/projects/stats/admin'),
  };

  // Careers API
  careers = {
    getAll: () => this.request('/careers'),
    getOne: (id) => this.request(`/careers/${id}`),
    create: (data) => this.request('/careers', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/careers/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/careers/stats/admin'),
  };

  // Certifications API
  certifications = {
    getAll: () => this.request('/certifications'),
    getOne: (id) => this.request(`/certifications/${id}`),
    create: (data) => this.request('/certifications', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/certifications/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/certifications/stats/admin'),
  };

  // Partnerships API
  partnerships = {
    getAll: () => this.request('/partnerships'),
    getOne: (id) => this.request(`/partnerships/${id}`),
    create: (data) => this.request('/partnerships', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/partnerships/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/partnerships/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/partnerships/stats/admin'),
  };

  // Press API
  press = {
    getAll: () => this.request('/press'),
    getOne: (id) => this.request(`/press/${id}`),
    create: (data) => this.request('/press', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/press/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/press/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/press/stats/admin'),
  };

  // News API
  news = {
    getAll: () => this.request('/news'),
    getOne: (id) => this.request(`/news/${id}`),
    create: (data) => this.request('/news', {
      method: 'POST',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    update: (id, data) => this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, lang: this.getCurrentLanguage() }),
    }),
    delete: (id) => this.request(`/news/${id}`, { method: 'DELETE' }),
    getStats: () => this.request('/news/stats/admin'),
  };

  // Dashboard stats
  async getDashboardStats() {
    try {
      const [projects, certifications, partnerships, awards, careers] = await Promise.allSettled([
        this.projects.getStats(),
        this.certifications.getStats(),
        this.partnerships.getStats(),
        this.awards.getStats(),
        this.careers.getStats(),
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
      return {
        projects: { total: 0, thisMonth: 0 },
        certifications: { total: 0, thisMonth: 0 },
        partnerships: { total: 0, thisMonth: 0 },
        awards: { total: 0, thisMonth: 0 },
        careers: { total: 0, thisMonth: 0 },
      };
    }
  }
}

// Create and export a singleton instance
const languageApi = new LanguageApiService();
export default languageApi;
