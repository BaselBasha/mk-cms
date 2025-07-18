import { configureStore } from '@reduxjs/toolkit';
import awardsReducer from './awardsSlice';
import certificationsReducer from './certificationsSlice';
import newsReducer from './newsSlice';
import partnershipsReducer from './partnershipsSlice';
import projectsReducer from './projectsSlice';
import pressReducer from './pressSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    awards: awardsReducer,
    certifications: certificationsReducer,
    news: newsReducer,
    partnerships: partnershipsReducer,
    projects: projectsReducer,
    press: pressReducer,
    auth: authReducer,
  },
});

export default store; 