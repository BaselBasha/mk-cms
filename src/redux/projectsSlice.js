import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

const getLanguage = () => {
  if (typeof window !== 'undefined') {
    try { return localStorage.getItem('language') || 'en'; } catch (_) { return 'en'; }
  }
  return 'en';
};

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const language = getLanguage();
  const res = await fetch(`${ENDPOINTS.projects}/admin`, {
    headers: { 
      Authorization: `Bearer ${getToken()}`, 
      'Accept-Language': language 
    },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projects || data; // Handle both { projects: [...] } and [...] formats
});

export const fetchPublicProjects = createAsyncThunk(
  "projects/fetchPublic",
  async () => {
    console.log("Fetching public projects...");
    const language = getLanguage();
    const res = await fetch(`${ENDPOINTS.projects}/public`, { 
      headers: { 
        'Accept-Language': language 
      } 
    });
    if (!res.ok) throw new Error("Failed to fetch public projects");
    const data = await res.json();
    console.log("Public projects API response:", data);
    return data.projects || data;
  }
);

export const fetchPublicProjectsPaginated = createAsyncThunk(
  "projects/fetchPublicPaginated",
  async ({ page = 1, limit = 6, reset = false }, { getState }) => {
    console.log("Fetching paginated public projects...", { page, limit, reset });
    const language = getLanguage();
    
    // First try with pagination parameters
    let res = await fetch(`${ENDPOINTS.projects}/public?page=${page}&limit=${limit}`, { 
      headers: { 
        'Accept-Language': language 
      } 
    });
    
    // If that fails, try without pagination parameters
    if (!res.ok) {
      res = await fetch(`${ENDPOINTS.projects}/public`, { 
        headers: { 
          'Accept-Language': language 
        } 
      });
    }
    
    if (!res.ok) throw new Error("Failed to fetch public projects");
    const data = await res.json();
    console.log("Paginated public projects API response:", data);
    
    const allProjects = data.projects || data.data || data;
    
    // Check if backend provided pagination
    if (data.totalPages && data.currentPage) {
      // Backend supports pagination
      return { 
        projects: allProjects,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        total: data.total || allProjects.length,
        hasMore: data.hasMore || (page < data.totalPages),
        reset
      };
    } else {
      // Backend doesn't support pagination, implement client-side
      const total = allProjects.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProjects = allProjects.slice(startIndex, endIndex);
      
      return { 
        projects: paginatedProjects,
        totalPages,
        currentPage: page,
        total,
        hasMore: page < totalPages,
        reset,
        allItems: allProjects // Store all items for client-side pagination
      };
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id) => {
    const language = getLanguage();
    const res = await fetch(`${ENDPOINTS.projects}/admin/${id}`, {
      headers: { 
        Authorization: `Bearer ${getToken()}`, 
        'Accept-Language': language 
      },
    });
    if (!res.ok) throw new Error("Failed to fetch project");
    const data = await res.json();
    return data.project || data;
  }
);

export const fetchPublicProjectById = createAsyncThunk(
  "projects/fetchPublicById",
  async (id) => {
    const language = getLanguage();
    const res = await fetch(`${ENDPOINTS.projects}/public/${id}`, { 
      headers: { 
        'Accept-Language': language 
      } 
    });
    if (!res.ok) throw new Error("Failed to fetch public project");
    const data = await res.json();
    return data.project || data;
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async ({ data, lang }) => {
    const currentLang = lang || getLanguage();
    try { console.log('[Redux][projects] Creating project. Lang:', currentLang, 'Payload:', JSON.stringify(data)); } catch (_) {}
    const res = await fetch(ENDPOINTS.projects, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': currentLang,
      },
      body: JSON.stringify({ ...data, lang: currentLang }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[Redux][projects] Create failed -> Status:', res.status, 'Body:', text);
      throw new Error("Failed to create project");
    }
    const response = await res.json();
    return response.project || response; // Handle both { project: {...} } and {...} formats
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data, lang }) => {
    const currentLang = lang || getLanguage();
    const res = await fetch(`${ENDPOINTS.projects}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': currentLang,
      },
      body: JSON.stringify({ ...data, lang: currentLang }),
    });
    if (!res.ok) throw new Error("Failed to update project");
    const response = await res.json();
    return response.project || response; // Handle both { project: {...} } and {...} formats
  }
);

export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  const language = getLanguage();
  const res = await fetch(`${ENDPOINTS.projects}/${id}`, {
    method: "DELETE",
    headers: { 
      Authorization: `Bearer ${getToken()}`, 
      'Accept-Language': language 
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Redux][projects] Delete failed -> Status:', res.status, 'Body:', text);
    if (res.status === 403) {
      throw new Error("You do not have permission to delete this item");
    }
    throw new Error("Failed to delete project");
  }
  return id;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    publicItems: [],
    paginatedPublicItems: [],
    allPaginatedItems: [], // Store all items for client-side pagination
    currentItem: null,
    loading: false,
    paginationLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasMore: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    resetPaginatedItems: (state) => {
      state.paginatedPublicItems = [];
      state.allPaginatedItems = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasMore: false,
      };
    },
    // Action for client-side pagination when we have all items
    paginateClientSide: (state, action) => {
      const { page, limit } = action.payload;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      state.paginatedPublicItems = state.allPaginatedItems.slice(startIndex, endIndex);
      state.pagination = {
        currentPage: page,
        totalPages: Math.ceil(state.allPaginatedItems.length / limit),
        total: state.allPaginatedItems.length,
        hasMore: page < Math.ceil(state.allPaginatedItems.length / limit),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin actions
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Public actions
      .addCase(fetchPublicProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjects.fulfilled, (state, action) => {
        console.log("Redux: Setting publicItems to:", action.payload);
        state.loading = false;
        state.publicItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPublicProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Individual item actions
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchPublicProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchPublicProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CRUD actions
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProject = action.payload.project || action.payload;
        state.items.unshift(newProject); // Add to beginning of array
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (item) =>
            item._id === action.payload._id || item.id === action.payload.id
        );
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item._id !== action.payload && item.id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Paginated public actions
      .addCase(fetchPublicProjectsPaginated.pending, (state) => {
        state.paginationLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjectsPaginated.fulfilled, (state, action) => {
        console.log("Redux: Setting paginated publicItems to:", action.payload);
        state.paginationLoading = false;
        
        // Always set the current page items
        state.paginatedPublicItems = Array.isArray(action.payload.projects) ? action.payload.projects : [];
        
        // Store all items if provided (for client-side pagination)
        if (action.payload.allItems) {
          state.allPaginatedItems = action.payload.allItems;
        }
        
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchPublicProjectsPaginated.rejected, (state, action) => {
        state.paginationLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentItem, resetPaginatedItems, paginateClientSide } = projectsSlice.actions;
export default projectsSlice.reducer; 