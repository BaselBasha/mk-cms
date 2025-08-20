import { configureStore } from '@reduxjs/toolkit';
import awardsReducer from './awardsSlice';
import careersReducer from './careersSlice';
import certificationsReducer from './certificationsSlice';
import newsReducer from './newsSlice';
import partnershipsReducer from './partnershipsSlice';
import projectsReducer from './projectsSlice';
import pressReducer from './pressSlice';
import companiesReducer from './companiesSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    awards: awardsReducer,
    careers: careersReducer,
    certifications: certificationsReducer,
    news: newsReducer,
    partnerships: partnershipsReducer,
    projects: projectsReducer,
    press: pressReducer,
    companies: companiesReducer,
    auth: authReducer,
  },
});

export default store; 