import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.projects}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projects || data; // Handle both { projects: [...] } and [...] formats
});

export const fetchPublicProjects = createAsyncThunk(
  "projects/fetchPublic",
  async () => {
    console.log("Fetching public projects...");
    const res = await fetch(`${ENDPOINTS.projects}/public`);
    if (!res.ok) throw new Error("Failed to fetch public projects");
    const data = await res.json();
    console.log("Public projects API response:", data);
    return data.projects || data;
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id) => {
    const res = await fetch(`${ENDPOINTS.projects}/admin/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error("Failed to fetch project");
    const data = await res.json();
    return data.project || data;
  }
);

export const fetchPublicProjectById = createAsyncThunk(
  "projects/fetchPublicById",
  async (id) => {
    const res = await fetch(`${ENDPOINTS.projects}/public/${id}`);
    if (!res.ok) throw new Error("Failed to fetch public project");
    const data = await res.json();
    return data.project || data;
  }
);

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
    const response = await res.json();
    return response.project || response; // Handle both { project: {...} } and {...} formats
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.projects}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update project");
    const response = await res.json();
    return response.project || response; // Handle both { project: {...} } and {...} formats
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
  name: "projects",
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
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Public actions
      .addCase(fetchPublicProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjects.fulfilled, (state, action) => {
        console.log("Redux: Setting publicItems to:", action.payload);
        state.loading = false;
        state.publicItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPublicProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Individual item actions
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchPublicProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchPublicProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CRUD actions
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const newProject = action.payload.project || action.payload;
        state.items.unshift(newProject); // Add to beginning of array
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (item) =>
            item._id === action.payload._id || item.id === action.payload.id
        );
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item._id !== action.payload && item.id !== action.payload
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default projectsSlice.reducer; 