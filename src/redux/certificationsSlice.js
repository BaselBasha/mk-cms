import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

export const fetchCertifications = createAsyncThunk("certifications/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.certifications}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch certifications");
  const data = await res.json();
  return data.certifications || data;
});

export const fetchPublicCertifications = createAsyncThunk("certifications/fetchPublic", async () => {
  const res = await fetch(`${ENDPOINTS.certifications}/public`);
  if (!res.ok) throw new Error("Failed to fetch public certifications");
  const data = await res.json();
  return data.certifications || data;
});

export const fetchCertificationById = createAsyncThunk("certifications/fetchById", async (id) => {
  const res = await fetch(`${ENDPOINTS.certifications}/admin/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch certification");
  const data = await res.json();
  return data.certification || data;
});

export const fetchPublicCertificationById = createAsyncThunk("certifications/fetchPublicById", async (id) => {
  const res = await fetch(`${ENDPOINTS.certifications}/public/${id}`);
  if (!res.ok) throw new Error("Failed to fetch public certification");
  const data = await res.json();
  return data.certification || data;
});

export const createCertification = createAsyncThunk(
  "certifications/create",
  async (data) => {
    const res = await fetch(ENDPOINTS.certifications, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create certification");
    const response = await res.json();
    return response.certification || response;
  }
);

export const updateCertification = createAsyncThunk(
  "certifications/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.certifications}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update certification");
    const response = await res.json();
    return response.certification || response;
  }
);

export const deleteCertification = createAsyncThunk("certifications/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.certifications}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete certification");
  return id;
});

const certificationsSlice = createSlice({
  name: 'certifications',
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
      .addCase(fetchCertifications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCertifications.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchCertifications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Public actions
      .addCase(fetchPublicCertifications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicCertifications.fulfilled, (state, action) => { 
        state.loading = false; 
        state.publicItems = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchPublicCertifications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Individual item actions
      .addCase(fetchCertificationById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCertificationById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchCertificationById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      .addCase(fetchPublicCertificationById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicCertificationById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchPublicCertificationById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // CRUD actions
      .addCase(createCertification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCertification.fulfilled, (state, action) => { 
        state.loading = false; 
        const newCertification = action.payload.certification || action.payload;
        state.items.unshift(newCertification);
      })
      .addCase(createCertification.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateCertification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCertification.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCertification.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deleteCertification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deleteCertification.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default certificationsSlice.reducer; 