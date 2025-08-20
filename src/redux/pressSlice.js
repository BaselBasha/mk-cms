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
    const res = await fetch(`${ENDPOINTS.press}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': lang || getLanguage(),
      },
      body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
    });
    if (!res.ok) throw new Error("Failed to update press");
    const response = await res.json();
    return response.press || response;
  }
);

export const deletePress = createAsyncThunk("press/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.press}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to delete press");
  return id;
});

const pressSlice = createSlice({
  name: "press",
  initialState: {
    items: [],
    publicItems: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {},
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
      });
  },
});

export default pressSlice.reducer; 