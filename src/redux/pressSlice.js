import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

const getLanguage = () => {
  if (typeof window !== 'undefined') {
    try { return localStorage.getItem('language') || 'en'; } catch (_) { return 'en'; }
  }
  return 'en';
};

export const fetchPress = createAsyncThunk("press/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.press}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch press");
  const data = await res.json();
  return data.press || data;
});

export const fetchPublicPress = createAsyncThunk(
  "press/fetchPublicAll",
  async () => {
    console.log("Fetching public press articles...");
    const res = await fetch(`${ENDPOINTS.press}/public`, { headers: { 'Accept-Language': getLanguage() } });
    if (!res.ok) throw new Error("Failed to fetch public press");
    const data = await res.json();
    console.log("Public press API response:", data);
    return data.press || data;
  }
);

export const fetchPublicPressPaginated = createAsyncThunk(
  "press/fetchPublicPaginated",
  async ({ page = 1, limit = 6, reset = false }) => {
    console.log("Fetching paginated public press...", { page, limit, reset });
    const res = await fetch(`${ENDPOINTS.press}/public?page=${page}&limit=${limit}`, { 
      headers: { 'Accept-Language': getLanguage() } 
    });
    if (!res.ok) throw new Error("Failed to fetch public press");
    const data = await res.json();
    console.log("Paginated public press API response:", data);
    return { 
      press: data.press || data.data || data,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || page,
      total: data.total || (data.press || data.data || data).length,
      hasMore: data.hasMore || (page < (data.totalPages || 1)),
      reset
    };
  }
);

export const fetchPressById = createAsyncThunk(
  "press/fetchById",
  async (id) => {
    const res = await fetch(`${ENDPOINTS.press}/admin/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
    });
    if (!res.ok) throw new Error("Failed to fetch press");
    const data = await res.json();
    return data.press || data;
  }
);

export const fetchPublicPressById = createAsyncThunk(
  "press/fetchPublicById",
  async (id) => {
    const res = await fetch(`${ENDPOINTS.press}/public/${id}`, { headers: { 'Accept-Language': getLanguage() } });
    if (!res.ok) throw new Error("Failed to fetch public press");
    const data = await res.json();
    return data.press || data;
  }
);

export const createPress = createAsyncThunk("press/create", async ({ data, lang }) => {
  const res = await fetch(ENDPOINTS.press, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      'Accept-Language': lang || getLanguage(),
    },
    body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
  });
  if (!res.ok) throw new Error("Failed to create press");
  const response = await res.json();
  return response.press || response;
});

export const updatePress = createAsyncThunk(
  "press/update",
  async ({ id, data, lang }) => {
    console.log('=== REDUX UPDATE PRESS ===');
    console.log('Update request:', { id, data, lang });
    console.log('Endpoint:', `${ENDPOINTS.press}/${id}`);
    
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      throw new Error('You must be logged in to update press articles. Please log in first.');
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');
    console.log('Headers:', {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      'Accept-Language': lang || getLanguage(),
    });
    
    // First, test if backend is reachable
    try {
      const healthCheck = await fetch(`${ENDPOINTS.press.replace('/api/press', '')}/api/health`);
      console.log('Backend health check status:', healthCheck.status);
    } catch (error) {
      console.error('Backend not reachable:', error);
      throw new Error('Backend server is not running. Please start the backend server first.');
    }
    
    try {
      const res = await fetch(`${ENDPOINTS.press}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          'Accept-Language': lang || getLanguage(),
        },
        body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend error response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Parsed error:', errorJson);
          throw new Error(errorJson.error || `HTTP ${res.status}: ${errorText}`);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      }
      
      const response = await res.json();
      console.log('Success response:', response);
      return response.press || response;
    } catch (error) {
      console.error('Update press error:', error);
      throw error;
    }
  }
);

export const deletePress = createAsyncThunk("press/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.press}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Redux][press] Delete failed -> Status:', res.status, 'Body:', text);
    if (res.status === 403) {
      throw new Error("You do not have permission to delete this item");
    }
    throw new Error("Failed to delete press");
  }
  return id;
});

const pressSlice = createSlice({
  name: "press",
  initialState: {
    items: [],
    publicItems: [],
    paginatedPublicItems: [],
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
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasMore: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPress.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPublicPress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPress.fulfilled, (state, action) => {
        console.log("Redux: Setting publicItems to:", action.payload);
        state.loading = false;
        state.publicItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPublicPress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPressById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchPressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPublicPressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPressById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchPublicPressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPress.fulfilled, (state, action) => {
        state.loading = false;
        const newPress = action.payload.press || action.payload;
        state.items.unshift(newPress);
      })
      .addCase(createPress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePress.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (item) =>
            item._id === action.payload._id || item.id === action.payload.id
        );
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updatePress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePress.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item._id !== action.payload && item.id !== action.payload
        );
      })
      .addCase(deletePress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Paginated public actions
      .addCase(fetchPublicPressPaginated.pending, (state) => {
        state.paginationLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicPressPaginated.fulfilled, (state, action) => {
        console.log("Redux: Setting paginated press to:", action.payload);
        state.paginationLoading = false;
        
        if (action.payload.reset) {
          state.paginatedPublicItems = Array.isArray(action.payload.press) ? action.payload.press : [];
        } else {
          // Append new items for infinite scroll
          const newItems = Array.isArray(action.payload.press) ? action.payload.press : [];
          state.paginatedPublicItems = [...state.paginatedPublicItems, ...newItems];
        }
        
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchPublicPressPaginated.rejected, (state, action) => {
        state.paginationLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentItem, resetPaginatedItems } = pressSlice.actions;
export default pressSlice.reducer; 