import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';

export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const res = await fetch(ENDPOINTS.news);
  if (!res.ok) throw new Error('Failed to fetch news');
  return await res.json();
});

export const createNews = createAsyncThunk('news/create', async (data) => {
  const res = await fetch(ENDPOINTS.news, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create news');
  return await res.json();
});

export const updateNews = createAsyncThunk('news/update', async ({ id, data }) => {
  const res = await fetch(`${ENDPOINTS.news}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update news');
  return await res.json();
});

export const deleteNews = createAsyncThunk('news/delete', async (id) => {
  const res = await fetch(`${ENDPOINTS.news}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete news');
  return id;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNews.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchNews.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createNews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNews.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
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