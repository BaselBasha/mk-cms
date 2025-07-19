import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const res = await fetch(ENDPOINTS.projects, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return await res.json();
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (data) => {
    const res = await fetch(ENDPOINTS.projects, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return await res.json();
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.projects}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return await res.json();
  }
);

export const deleteProject = createAsyncThunk("projects/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.projects}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createProject.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
      .addCase(createProject.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deleteProject.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default projectsSlice.reducer; 