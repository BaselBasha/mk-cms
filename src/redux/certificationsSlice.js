import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

export const fetchCertifications = createAsyncThunk(
  "certifications/fetchAll",
  async () => {
    const token = getToken();
    const res = await fetch(ENDPOINTS.certifications, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch certifications");
    return await res.json();
  }
);

export const createCertification = createAsyncThunk(
  "certifications/create",
  async (data) => {
    const token = getToken();
    const res = await fetch(ENDPOINTS.certifications, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create certification");
    return await res.json();
  }
);

export const updateCertification = createAsyncThunk(
  "certifications/update",
  async ({ id, data }) => {
    const token = getToken();
    const res = await fetch(`${ENDPOINTS.certifications}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update certification");
    return await res.json();
  }
);

export const deleteCertification = createAsyncThunk(
  "certifications/delete",
  async (id) => {
    const token = getToken();
    const res = await fetch(`${ENDPOINTS.certifications}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete certification");
    return id;
  }
);

const certificationsSlice = createSlice({
  name: 'certifications',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCertifications.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCertifications.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createCertification.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCertification.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
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