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

export const fetchPublicCompaniesPaginated = createAsyncThunk(
  "companies/fetchPublicPaginated",
  async ({ page = 1, limit = 6, reset = false }) => {
    console.log("Fetching paginated public companies...", { page, limit, reset });
    
    // First try with pagination parameters
    let res = await fetch(`${ENDPOINTS.companies}/public?page=${page}&limit=${limit}`, {
      headers: { 'Accept-Language': getLanguage() },
    });
    
    // If that fails, try without pagination parameters
    if (!res.ok) {
      res = await fetch(`${ENDPOINTS.companies}/public`, {
        headers: { 'Accept-Language': getLanguage() },
      });
    }
    
    if (!res.ok) throw new Error("Failed to fetch public companies");
    const data = await res.json();
    console.log("Paginated public companies API response:", data);
    
    const allCompanies = data.companies || data.data || data;
    
    // Check if backend provided pagination
    if (data.totalPages && data.currentPage) {
      // Backend supports pagination
      return { 
        companies: allCompanies,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        total: data.total || allCompanies.length,
        hasMore: data.hasMore || (page < data.totalPages),
        reset
      };
    } else {
      // Backend doesn't support pagination, implement client-side
      const total = allCompanies.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCompanies = allCompanies.slice(startIndex, endIndex);
      
      return { 
        companies: paginatedCompanies,
        totalPages,
        currentPage: page,
        total,
        hasMore: page < totalPages,
        reset,
        allItems: allCompanies
      };
    }
  }
);

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
  if (!res.ok) {
    const text = await res.text();
    console.error('[Redux][companies] Delete failed -> Status:', res.status, 'Body:', text);
    if (res.status === 403) {
      throw new Error("You do not have permission to delete this item");
    }
    throw new Error("Failed to delete company");
  }
  return id;
});

const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    items: [],
    publicItems: [],
    paginatedPublicItems: [],
    allPaginatedItems: [],
    currentItem: null,
    loading: false,
    paginationLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      hasMore: false,
    },
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentItem: (state) => { state.currentItem = null; },
    resetPaginatedItems: (state) => {
      state.paginatedPublicItems = [];
      state.allPaginatedItems = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        hasMore: false,
      };
    },
    paginateClientSide: (state, action) => {
      const { page, limit } = action.payload;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      state.paginatedPublicItems = state.allPaginatedItems.slice(startIndex, endIndex);
      state.pagination = {
        currentPage: page,
        totalPages: Math.ceil(state.allPaginatedItems.length / limit),
        total: state.allPaginatedItems.length,
        hasMore: page < Math.ceil(state.allPaginatedItems.length / limit),
      };
    },
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
      .addCase(deleteCompany.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      // Paginated public actions
      .addCase(fetchPublicCompaniesPaginated.pending, (state) => {
        state.paginationLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCompaniesPaginated.fulfilled, (state, action) => {
        console.log("Redux: Setting paginated companies to:", action.payload);
        state.paginationLoading = false;
        
        state.paginatedPublicItems = Array.isArray(action.payload.companies) ? action.payload.companies : [];
        
        if (action.payload.allItems) {
          state.allPaginatedItems = action.payload.allItems;
        }
        
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchPublicCompaniesPaginated.rejected, (state, action) => {
        state.paginationLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentItem, resetPaginatedItems, paginateClientSide } = companiesSlice.actions;
export default companiesSlice.reducer;


