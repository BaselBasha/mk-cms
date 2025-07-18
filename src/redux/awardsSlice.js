import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';

export const fetchAwards = createAsyncThunk('awards/fetchAll', async () => {
  const res = await fetch(ENDPOINTS.awards);
  if (!res.ok) throw new Error('Failed to fetch awards');
  return await res.json();
});

export const createAward = createAsyncThunk('awards/create', async (data) => {
  const res = await fetch(ENDPOINTS.awards, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create award');
  return await res.json();
});

export const updateAward = createAsyncThunk('awards/update', async ({ id, data }) => {
  const res = await fetch(`${ENDPOINTS.awards}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update award');
  return await res.json();
});

export const deleteAward = createAsyncThunk('awards/delete', async (id) => {
  const res = await fetch(`${ENDPOINTS.awards}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete award');
  return id;
});

const awardsSlice = createSlice({
  name: 'awards',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAwards.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchAwards.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createAward.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createAward.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
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