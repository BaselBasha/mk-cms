import { ENDPOINTS } from './endpoints';

// File sharing API service
class FileSharingApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
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

    const config = {
      headers: {
        'Content-Type': 'application/json',
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

  // Get shared files for an entity
  async getSharedFiles(entityType, entityId, language) {
    return await this.request(`/filesharing/${entityType}/${entityId}/${language}`);
  }

  // Sync file references between language models
  async syncFileReferences(entityType, entityId, sourceLanguage, targetLanguage) {
    return await this.request(`/filesharing/sync/${entityType}/${entityId}`, {
      method: 'POST',
      body: JSON.stringify({ sourceLanguage, targetLanguage }),
    });
  }

  // Get file statistics for admin dashboard
  async getFileStats() {
    return await this.request('/filesharing/stats/admin');
  }

  // Remove shared files for an entity
  async removeSharedFiles(entityType, entityId) {
    return await this.request(`/filesharing/${entityType}/${entityId}`, {
      method: 'DELETE',
    });
  }

  // Utility method to check if files are shared between languages
  async checkFileSharing(entityType, entityId, language) {
    try {
      const response = await this.getSharedFiles(entityType, entityId, language);
      return {
        hasSharedFiles: Object.keys(response.sharedFiles).length > 0,
        sharedFiles: response.sharedFiles
      };
    } catch (error) {
      console.error('Error checking file sharing:', error);
      return { hasSharedFiles: false, sharedFiles: {} };
    }
  }

  // Utility method to get file sharing status for multiple entities
  async getFileSharingStatus(entityType, entityIds, language) {
    try {
      const promises = entityIds.map(id => 
        this.checkFileSharing(entityType, id, language)
      );
      const results = await Promise.all(promises);
      
      return entityIds.reduce((acc, id, index) => {
        acc[id] = results[index];
        return acc;
      }, {});
    } catch (error) {
      console.error('Error getting file sharing status:', error);
      return {};
    }
  }
}

// Create and export a singleton instance
const fileSharingApi = new FileSharingApiService();
export default fileSharingApi;
