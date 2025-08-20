import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

const getLanguage = () => {
  if (typeof window !== 'undefined') {
    try { return localStorage.getItem('language') || 'en'; } catch (_) { return 'en'; }
  }
  return 'en';
};

export const fetchNews = createAsyncThunk("news/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.news}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.news || data;
});

export const fetchPublicNews = createAsyncThunk("news/fetchPublic", async () => {
  const res = await fetch(`${ENDPOINTS.news}/public`, { headers: { 'Accept-Language': getLanguage() } });
  if (!res.ok) throw new Error("Failed to fetch public news");
  const data = await res.json();
  return data.news || data;
});

export const fetchNewsById = createAsyncThunk("news/fetchById", async (id) => {
  const res = await fetch(`${ENDPOINTS.news}/admin/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.news || data;
});

export const fetchPublicNewsById = createAsyncThunk("news/fetchPublicById", async (id) => {
  const res = await fetch(`${ENDPOINTS.news}/public/${id}`, { headers: { 'Accept-Language': getLanguage() } });
  if (!res.ok) throw new Error("Failed to fetch public news");
  const data = await res.json();
  return data.news || data;
});

export const createNews = createAsyncThunk(
  "news/create",
  async ({ data, lang }) => {
    const res = await fetch(ENDPOINTS.news, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': lang || getLanguage(),
      },
      body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
    });
    if (!res.ok) throw new Error("Failed to create news");
    const response = await res.json();
    return response.news || response;
  }
);

export const updateNews = createAsyncThunk(
  "news/update",
  async ({ id, data, lang }) => {
    const res = await fetch(`${ENDPOINTS.news}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': lang || getLanguage(),
      },
      body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
    });
    if (!res.ok) throw new Error("Failed to update news");
    const response = await res.json();
    return response.news || response;
  }
);

export const deleteNews = createAsyncThunk("news/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.news}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to delete news");
  return id;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    publicItems: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin actions
      .addCase(fetchNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNews.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Public actions
      .addCase(fetchPublicNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicNews.fulfilled, (state, action) => { 
        state.loading = false; 
        state.publicItems = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchPublicNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Individual item actions
      .addCase(fetchNewsById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNewsById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchNewsById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      .addCase(fetchPublicNewsById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicNewsById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchPublicNewsById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // CRUD actions
      .addCase(createNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNews.fulfilled, (state, action) => { 
        state.loading = false; 
        const newNews = action.payload.news || action.payload;
        state.items.unshift(newNews);
      })
      .addCase(createNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deleteNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deleteNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default newsSlice.reducer; 