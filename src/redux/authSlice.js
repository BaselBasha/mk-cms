import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../shared/endpoints";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(ENDPOINTS.auth + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Invalid credentials" }));
        return rejectWithValue(errorData.message || "Invalid credentials");
      }

      return await res.json();
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(ENDPOINTS.auth + "/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Logout failed" }));
        return rejectWithValue(errorData.message || "Logout failed");
      }

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    // Ensure payload uses 'username' for backend compatibility
    const payload = {
      username: userData.username || userData.name || "",
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    };
    try {
      const res = await fetch(ENDPOINTS.auth + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Signup failed" }));
        return rejectWithValue(errorData.message || "Signup failed");
      }

      return await res.json();
    } catch (error) {
      console.error("Signup error:", error);
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
