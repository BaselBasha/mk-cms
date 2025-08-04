import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

export const fetchAwards = createAsyncThunk("awards/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.awards}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch awards");
  const data = await res.json();
  return data.awards || data;
});

export const fetchPublicAwards = createAsyncThunk("awards/fetchPublic", async () => {
  const res = await fetch(`${ENDPOINTS.awards}/public`);
  if (!res.ok) throw new Error("Failed to fetch public awards");
  const data = await res.json();
  return data.awards || data;
});

export const fetchAwardById = createAsyncThunk("awards/fetchById", async (id) => {
  const res = await fetch(`${ENDPOINTS.awards}/admin/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch award");
  const data = await res.json();
  return data.award || data;
});

export const fetchPublicAwardById = createAsyncThunk("awards/fetchPublicById", async (id) => {
  const res = await fetch(`${ENDPOINTS.awards}/public/${id}`);
  if (!res.ok) throw new Error("Failed to fetch public award");
  const data = await res.json();
  return data.award || data;
});

export const createAward = createAsyncThunk(
  "awards/create",
  async (data) => {
    const res = await fetch(ENDPOINTS.awards, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create award");
    const response = await res.json();
    return response.award || response;
  }
);

export const updateAward = createAsyncThunk(
  "awards/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.awards}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update award");
    const response = await res.json();
    return response.award || response;
  }
);

export const deleteAward = createAsyncThunk("awards/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.awards}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete award");
  return id;
});

const awardsSlice = createSlice({
  name: 'awards',
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
      .addCase(fetchAwards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAwards.fulfilled, (state, action) => { 
        state.loading = false; 
        state.items = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchAwards.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Public actions
      .addCase(fetchPublicAwards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicAwards.fulfilled, (state, action) => { 
        state.loading = false; 
        state.publicItems = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchPublicAwards.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // Individual item actions
      .addCase(fetchAwardById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAwardById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchAwardById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      .addCase(fetchPublicAwardById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicAwardById.fulfilled, (state, action) => { 
        state.loading = false; 
        state.currentItem = action.payload; 
      })
      .addCase(fetchPublicAwardById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // CRUD actions
      .addCase(createAward.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createAward.fulfilled, (state, action) => { 
        state.loading = false; 
        const newAward = action.payload.award || action.payload;
        state.items.unshift(newAward);
      })
      .addCase(createAward.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateAward.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateAward.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAward.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deleteAward.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteAward.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deleteAward.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default awardsSlice.reducer; 