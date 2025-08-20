import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ENDPOINTS } from '../shared/endpoints';

// Helper function to get token from localStorage
const getAuthToken = () => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) return null;

    try {
        const admin = JSON.parse(adminData);
        return admin.token || null;
    } catch (error) {
        console.error('Error parsing admin data:', error);
        return null;
    }
};

const getLanguage = () => {
    if (typeof window !== 'undefined') {
        try { return localStorage.getItem('language') || 'en'; } catch (_) { return 'en'; }
    }
    return 'en';
};

// Async thunks for API calls
export const fetchCareers = createAsyncThunk('careers/fetchAll', async () => {
    const token = getAuthToken();
    const res = await fetch(`${ENDPOINTS.careers}/admin/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept-Language': getLanguage(),
        },
    });
    if (!res.ok) throw new Error('Failed to fetch careers');
    const data = await res.json();
    return data.careers || data;
});

export const fetchCareerById = createAsyncThunk('careers/fetchById', async (id) => {
    const token = getAuthToken();
    const res = await fetch(`${ENDPOINTS.careers}/admin/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept-Language': getLanguage(),
        },
    });
    if (!res.ok) throw new Error('Failed to fetch career');
    const data = await res.json();
    return data.career || data;
});

export const fetchPublicCareers = createAsyncThunk('careers/fetchPublic', async () => {
    const res = await fetch(`${ENDPOINTS.careers}/public`, { headers: { 'Accept-Language': getLanguage() } });
    if (!res.ok) throw new Error('Failed to fetch public careers');
    return await res.json();
});

export const createCareer = createAsyncThunk('careers/create', async ({ data, lang }) => {
    const token = getAuthToken();
    const res = await fetch(ENDPOINTS.careers, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept-Language': lang || getLanguage(),
        },
        body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
    });
    if (!res.ok) throw new Error('Failed to create career');
    return await res.json();
});

export const updateCareer = createAsyncThunk('careers/update', async ({ id, data, lang }) => {
    const token = getAuthToken();
    const res = await fetch(`${ENDPOINTS.careers}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept-Language': lang || getLanguage(),
        },
        body: JSON.stringify({ ...data, lang: lang || getLanguage() }),
    });
    if (!res.ok) throw new Error('Failed to update career');
    const response = await res.json();
    return response.career || response;
});

export const deleteCareer = createAsyncThunk('careers/delete', async (id) => {
    const token = getAuthToken();
    const res = await fetch(`${ENDPOINTS.careers}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept-Language': getLanguage() }
    });
    if (!res.ok) throw new Error('Failed to delete career');
    return id;
});

export const toggleCareerStatus = createAsyncThunk('careers/toggleStatus', async ({ id, isActive }) => {
    const res = await fetch(`${ENDPOINTS.careers}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
    });
    if (!res.ok) throw new Error('Failed to toggle career status');
    return await res.json();
});

// Initial state
const initialState = {
    items: [],
    publicItems: [],
    currentItem: null,
    loading: false,
    error: null,
    success: null,
};

// Careers slice
const careersSlice = createSlice({
    name: 'careers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        clearCurrentItem: (state) => {
            state.currentItem = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all careers (admin)
            .addCase(fetchCareers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCareers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.careers || action.payload;
            })
            .addCase(fetchCareers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch public careers
            .addCase(fetchPublicCareers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicCareers.fulfilled, (state, action) => {
                state.loading = false;
                state.publicItems = action.payload.careers || action.payload;
            })
            .addCase(fetchPublicCareers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch career by ID
            .addCase(fetchCareerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCareerById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload.career || action.payload;
            })
            .addCase(fetchCareerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create career
            .addCase(createCareer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createCareer.fulfilled, (state, action) => {
                state.loading = false;
                const newCareer = action.payload.career || action.payload;
                state.items.unshift(newCareer);
                state.success = 'Career created successfully';
            })
            .addCase(createCareer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update career
            .addCase(updateCareer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateCareer.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCareer = action.payload.career || action.payload;
                const idx = state.items.findIndex((item) => item._id === updatedCareer._id || item.id === updatedCareer.id);
                if (idx !== -1) {
                    state.items[idx] = updatedCareer;
                }
                // Also update in public items if it exists
                const publicIdx = state.publicItems.findIndex((item) => item._id === updatedCareer._id || item.id === updatedCareer.id);
                if (publicIdx !== -1) {
                    state.publicItems[publicIdx] = updatedCareer;
                }
                state.success = 'Career updated successfully';
            })
            .addCase(updateCareer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete career
            .addCase(deleteCareer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(deleteCareer.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.items = state.items.filter((item) => item._id !== deletedId && item.id !== deletedId);
                state.publicItems = state.publicItems.filter((item) => item._id !== deletedId && item.id !== deletedId);
                state.success = 'Career deleted successfully';
            })
            .addCase(deleteCareer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Toggle career status
            .addCase(toggleCareerStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(toggleCareerStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCareer = action.payload.career || action.payload;
                const idx = state.items.findIndex((item) => item._id === updatedCareer._id || item.id === updatedCareer.id);
                if (idx !== -1) {
                    state.items[idx] = updatedCareer;
                }
                // Also update in public items if it exists
                const publicIdx = state.publicItems.findIndex((item) => item._id === updatedCareer._id || item.id === updatedCareer.id);
                if (publicIdx !== -1) {
                    state.publicItems[publicIdx] = updatedCareer;
                }
                state.success = `Career ${updatedCareer.isActive ? 'activated' : 'deactivated'} successfully`;
            })
            .addCase(toggleCareerStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export actions
export const { clearError, clearSuccess, clearCurrentItem, setLoading } = careersSlice.actions;

// Export selectors
export const selectCareers = (state) => state.careers.items;
export const selectPublicCareers = (state) => state.careers.publicItems;
export const selectCurrentCareer = (state) => state.careers.currentItem;
export const selectCareersLoading = (state) => state.careers.loading;
export const selectCareersError = (state) => state.careers.error;
export const selectCareersSuccess = (state) => state.careers.success;

// Export reducer
export default careersSlice.reducer; 