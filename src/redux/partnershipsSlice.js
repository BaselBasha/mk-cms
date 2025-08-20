import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

// Helper to read current UI language (defaults to 'en')
const getLanguage = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (e) {
      return 'en';
    }
  }
  return 'en';
};

export const fetchPartnerships = createAsyncThunk("partnerships/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.partnerships}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch partnerships");
  const data = await res.json();
  return data.partnerships || data;
});

export const fetchPublicPartnerships = createAsyncThunk("partnerships/fetchPublic", async () => {
  const res = await fetch(`${ENDPOINTS.partnerships}/public`, {
    headers: { 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch public partnerships");
  const data = await res.json();
  return data.partnerships || data;
});

export const fetchPartnershipById = createAsyncThunk("partnerships/fetchById", async (id) => {
  const res = await fetch(`${ENDPOINTS.partnerships}/admin/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch partnership");
  const data = await res.json();
  return data.partnership || data;
});

export const fetchPublicPartnershipById = createAsyncThunk("partnerships/fetchPublicById", async (id) => {
  const res = await fetch(`${ENDPOINTS.partnerships}/public/${id}`, {
    headers: { 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch public partnership");
  const data = await res.json();
  return data.partnership || data;
});

export const createPartnership = createAsyncThunk(
  "partnerships/create",
  async ({ data, lang }) => {
    const currentLang = lang || getLanguage();
    try {
      console.log('[Redux][partnerships] Creating partnership. Lang:', currentLang);
      console.log('[Redux][partnerships] Payload:', JSON.stringify(data));
    } catch (_) {
      console.log('[Redux][partnerships] Payload not serializable');
    }
    const res = await fetch(ENDPOINTS.partnerships, {
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
      console.error('[Redux][partnerships] Create failed -> Status:', res.status, 'Body:', text);
      throw new Error("Failed to create partnership");
    }
    const response = await res.json();
    return response.partnership || response;
  }
);

export const updatePartnership = createAsyncThunk(
  "partnerships/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.partnerships}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': getLanguage(),
      },
      body: JSON.stringify({ ...data, lang: getLanguage() }),
    });
    if (!res.ok) throw new Error("Failed to update partnership");
    const response = await res.json();
    return response.partnership || response;
  }
);

export const deletePartnership = createAsyncThunk("partnerships/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.partnerships}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to delete partnership");
  return id;
});

const partnershipsSlice = createSlice({
  name: 'partnerships',
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
      .addCase(fetchPartnerships.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPartnerships.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchPartnerships.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Public actions
      .addCase(fetchPublicPartnerships.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicPartnerships.fulfilled, (state, action) => { 
        state.loading = false; 
        state.publicItems = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchPublicPartnerships.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Individual item actions
      .addCase(fetchPartnershipById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPartnershipById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchPartnershipById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      .addCase(fetchPublicPartnershipById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicPartnershipById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchPublicPartnershipById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // CRUD actions
      .addCase(createPartnership.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPartnership.fulfilled, (state, action) => { 
        state.loading = false; 
        const newPartnership = action.payload.partnership || action.payload;
        state.items.unshift(newPartnership);
      })
      .addCase(createPartnership.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updatePartnership.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePartnership.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updatePartnership.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deletePartnership.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deletePartnership.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deletePartnership.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default partnershipsSlice.reducer; 