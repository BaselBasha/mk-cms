import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';

export const fetchPartnerships = createAsyncThunk('partnerships/fetchAll', async () => {
  const res = await fetch(ENDPOINTS.partnerships);
  if (!res.ok) throw new Error('Failed to fetch partnerships');
  return await res.json();
});

export const createPartnership = createAsyncThunk('partnerships/create', async (data) => {
  const res = await fetch(ENDPOINTS.partnerships, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create partnership');
  return await res.json();
});

export const updatePartnership = createAsyncThunk('partnerships/update', async ({ id, data }) => {
  const res = await fetch(`${ENDPOINTS.partnerships}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update partnership');
  return await res.json();
});

export const deletePartnership = createAsyncThunk('partnerships/delete', async (id) => {
  const res = await fetch(`${ENDPOINTS.partnerships}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete partnership');
  return id;
});

const partnershipsSlice = createSlice({
  name: 'partnerships',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerships.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPartnerships.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchPartnerships.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createPartnership.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPartnership.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
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