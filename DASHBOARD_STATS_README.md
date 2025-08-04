# Dynamic Admin Dashboard Statistics

## Overview

The admin dashboard now displays real-time statistics fetched from the backend API instead of hardcoded values. This provides accurate, up-to-date information about your content.

## Features

### Backend Changes

1. **New Stats Endpoints**: Added statistics endpoints for all content types:
   - `GET /api/projects/stats/admin`
   - `GET /api/certifications/stats/admin`
   - `GET /api/partnerships/stats/admin`
   - `GET /api/awards/stats/admin`
   - `GET /api/careers/stats/admin`

2. **Statistics Data**: Each endpoint returns:
   - `total`: Total number of items
   - `published`: Number of published items
   - `draft`: Number of draft items
   - `featured`: Number of featured items
   - `thisMonth`: Number of items created this month

### Frontend Changes

1. **API Utility**: Created `src/utils/api.js` with:
   - Authentication token handling
   - Error handling with automatic logout on 401 errors
   - Promise.allSettled for robust API calls
   - Fallback values when API calls fail

2. **Dynamic Dashboard**: Updated `src/app/admin/page.js` with:
   - Real-time data fetching
   - Loading states with skeleton animations
   - Refresh button for manual updates
   - Error handling and fallback values

## How to Test

### 1. Start the Backend Server

```bash
cd mk-cms-back
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Test the Stats Endpoints

```bash
cd mk-cms-back
node test-stats.js
```

This will test all stats endpoints and show the current statistics.

### 3. Start the Frontend

```bash
cd mk-cms
npm install
npm run dev
```

### 4. Access the Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. Login with admin credentials
3. View the dashboard with real statistics

## API Response Format

Each stats endpoint returns data in this format:

```json
{
  "total": 15,
  "published": 12,
  "draft": 3,
  "featured": 5,
  "thisMonth": 2
}
```

## Error Handling

- **Authentication Errors**: Automatically redirects to login page
- **Network Errors**: Shows fallback values (0) instead of breaking
- **Partial Failures**: Uses Promise.allSettled to handle individual endpoint failures
- **Loading States**: Shows skeleton animations while data loads

## Refresh Functionality

- Click the "Refresh" button to manually update statistics
- Button shows spinning animation during refresh
- Disabled during refresh to prevent multiple requests

## Database Requirements

Make sure your MongoDB collections have the following fields for accurate statistics:

- `status`: "published", "draft", etc.
- `featured`: boolean
- `createdAt`: timestamp
- `isActive`: boolean (for careers)

## Troubleshooting

### Common Issues

1. **Stats showing 0**: Check if your database has data and the collections exist
2. **Authentication errors**: Verify admin token is valid
3. **Network errors**: Ensure backend server is running on correct port (5000)
4. **CORS errors**: Check frontend URL in backend CORS configuration

### Debug Steps

1. Check browser console for API errors
2. Verify backend server is running: `http://localhost:5000/api/health`
3. Test individual endpoints with the test script
4. Check MongoDB connection and data

## Future Enhancements

- Real-time updates with WebSocket
- More detailed analytics (views, engagement, etc.)
- Export statistics to CSV/PDF
- Historical data trends
- Custom date range filtering 