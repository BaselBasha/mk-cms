import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';
import { getToken } from "../shared/auth";

const getLanguage = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (e) {
      return 'en';
    }
  }
  return 'en';
};

export const fetchCompanies = createAsyncThunk("companies/fetchAll", async () => {
  const res = await fetch(`${ENDPOINTS.companies}/admin`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch companies");
  const data = await res.json();
  return data.companies || data;
});

export const fetchPublicCompanies = createAsyncThunk("companies/fetchPublic", async () => {
  const res = await fetch(`${ENDPOINTS.companies}/public`, {
    headers: { 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch public companies");
  const data = await res.json();
  return data.companies || data;
});

export const fetchCompanyById = createAsyncThunk("companies/fetchById", async (id) => {
  const res = await fetch(`${ENDPOINTS.companies}/admin/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to fetch company");
  const data = await res.json();
  return data.company || data;
});

export const createCompany = createAsyncThunk(
  "companies/create",
  async ({ data, lang }) => {
    const currentLang = lang || getLanguage();
    try {
      console.log('[Redux][companies] Creating company. Lang:', currentLang);
      console.log('[Redux][companies] Payload:', JSON.stringify(data));
    } catch (_) {
      console.log('[Redux][companies] Payload not serializable');
    }
    const res = await fetch(ENDPOINTS.companies, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': currentLang,
      },
      body: JSON.stringify({ ...data, lang: currentLang }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[Redux][companies] Create failed -> Status:', res.status, 'Body:', text);
      throw new Error("Failed to create company");
    }
    const response = await res.json();
    return response.company || response;
  }
);

export const updateCompany = createAsyncThunk(
  "companies/update",
  async ({ id, data }) => {
    const res = await fetch(`${ENDPOINTS.companies}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        'Accept-Language': getLanguage(),
      },
      body: JSON.stringify({ ...data, lang: getLanguage() }),
    });
    if (!res.ok) throw new Error("Failed to update company");
    const response = await res.json();
    return response.company || response;
  }
);

export const deleteCompany = createAsyncThunk("companies/delete", async (id) => {
  const res = await fetch(`${ENDPOINTS.companies}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}`, 'Accept-Language': getLanguage() },
  });
  if (!res.ok) throw new Error("Failed to delete company");
  return id;
});

const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    items: [],
    publicItems: [],
    currentItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentItem: (state) => { state.currentItem = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCompanies.fulfilled, (state, action) => { state.loading = false; state.items = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchCompanies.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchPublicCompanies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublicCompanies.fulfilled, (state, action) => { state.loading = false; state.publicItems = Array.isArray(action.payload) ? action.payload : []; })
      .addCase(fetchPublicCompanies.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchCompanyById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCompanyById.fulfilled, (state, action) => { state.loading = false; state.currentItem = action.payload; })
      .addCase(fetchCompanyById.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(createCompany.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCompany.fulfilled, (state, action) => { state.loading = false; const newItem = action.payload.company || action.payload; state.items.unshift(newItem); })
      .addCase(createCompany.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(updateCompany.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((item) => item._id === action.payload._id || item.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(deleteCompany.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteCompany.fulfilled, (state, action) => { state.loading = false; state.items = state.items.filter((item) => item._id !== action.payload && item.id !== action.payload); })
      .addCase(deleteCompany.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default companiesSlice.reducer;


