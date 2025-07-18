import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';

export const fetchPress = createAsyncThunk('press/fetchAll', async () => {
  const res = await fetch(ENDPOINTS.press);
  if (!res.ok) throw new Error('Failed to fetch press');
  return await res.json();
});

export const createPress = createAsyncThunk('press/create', async (data) => {
  const res = await fetch(ENDPOINTS.press, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create press');
  return await res.json();
});

export const updatePress = createAsyncThunk('press/update', async ({ id, data }) => {
  const res = await fetch(`${ENDPOINTS.press}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update press');
  return await res.json();
});

export const deletePress = createAsyncThunk('press/delete', async (id) => {
  const res = await fetch(`${ENDPOINTS.press}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete press');
  return id;
});

const pressSlice = createSlice({
  name: 'press',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPress.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchPress.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createPress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPress.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createPress.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updatePress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePress.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updatePress.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deletePress.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deletePress.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deletePress.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default pressSlice.reducer; 