# Individual Award Pages Feature

## Overview
This feature adds individual pages for each award, allowing users to view detailed information, photos, and content for specific awards.

## Features

### 1. Individual Award Pages (`/awards/[id]`)
- **Dynamic routing** using Next.js App Router
- **Detailed award information** including title, summary, description, and features
- **Image gallery** with navigation controls for multiple images
- **Document downloads** for related files
- **Responsive design** that works on all devices
- **Smooth animations** using Framer Motion

### 2. Enhanced Awards Listing (`/awards`)
- **Clickable award cards** that link to individual pages
- **Improved hover effects** and visual feedback
- **"View Details" button** on each card

### 3. Updated Homepage Awards Sections
- **Clickable award cards** in both the main awards section and slider
- **Consistent navigation** to individual award pages

## Technical Implementation

### Frontend Structure
```
src/app/awards/
├── page.js              # Awards listing page
└── [id]/
    └── page.js          # Individual award page
```

### Key Components

#### Individual Award Page (`[id]/page.js`)
- **Image Gallery**: Displays main award image and document images
- **Navigation Controls**: Previous/next buttons and thumbnail navigation
- **Content Sections**: Description, features, and award details
- **Sidebar**: Award metadata and document downloads
- **Responsive Layout**: Adapts to different screen sizes

#### Awards Listing Page (`page.js`)
- **Grid Layout**: Responsive grid of award cards
- **Hover Effects**: Visual feedback on interaction
- **Navigation**: Links to individual award pages

### Data Flow
1. **Redux State**: Uses `awardsSlice` for state management
2. **API Calls**: `fetchPublicAwardById` for individual awards
3. **Dynamic Routing**: Next.js handles URL parameters
4. **Error Handling**: Graceful fallbacks for missing data

### Styling
- **Consistent Theme**: Matches the existing green color scheme (`#65a30d`)
- **Glass Morphism**: Modern backdrop blur effects
- **Smooth Transitions**: CSS transitions and Framer Motion animations
- **Responsive Design**: Mobile-first approach

## Usage

### For Users
1. **Browse Awards**: Visit `/awards` to see all awards
2. **View Details**: Click on any award card to see the full page
3. **Navigate Gallery**: Use arrow buttons or thumbnails to browse images
4. **Download Documents**: Click on document links to download files

### For Developers
1. **Add Awards**: Use the admin panel to create new awards
2. **Upload Images**: Add main images and document images
3. **Manage Content**: Edit descriptions, features, and metadata
4. **Customize Styling**: Modify CSS classes for design changes

## API Endpoints

### Backend Routes
- `GET /api/awards/public` - Get all public awards
- `GET /api/awards/public/:id` - Get specific public award
- `POST /api/awards` - Create new award (admin)
- `PATCH /api/awards/:id` - Update award (admin)
- `DELETE /api/awards/:id` - Delete award (admin)

### Redux Actions
- `fetchPublicAwards()` - Fetch all awards
- `fetchPublicAwardById(id)` - Fetch specific award
- `createAward(data)` - Create new award
- `updateAward({id, data})` - Update award
- `deleteAward(id)` - Delete award

## File Structure

### Award Model (`mk-cms-back/models/Award.js`)
```javascript
{
  title: String,
  summary: String,
  description: String,
  awardingBody: String,
  awardDate: Date,
  category: String,
  level: String,
  features: [String],
  image: { url: String, name: String, type: String },
  documents: [{ url: String, name: String, type: String }]
}
```

### Key Features
- **Image Support**: Main award image and multiple document images
- **Rich Content**: Detailed descriptions and feature lists
- **Metadata**: Category, level, awarding body, and date
- **File Management**: Document uploads and downloads

## Future Enhancements

### Potential Improvements
1. **SEO Optimization**: Meta tags and structured data
2. **Social Sharing**: Share buttons for individual awards
3. **Related Awards**: Show similar awards on individual pages
4. **Search & Filter**: Advanced filtering on the listing page
5. **Award Categories**: Category-based navigation
6. **Timeline View**: Chronological display of awards
7. **Export Options**: PDF generation for award details

### Performance Optimizations
1. **Image Optimization**: Next.js Image component integration
2. **Lazy Loading**: Progressive image loading
3. **Caching**: Redux persistence and API caching
4. **Code Splitting**: Dynamic imports for better performance

## Testing

### Manual Testing Checklist
- [ ] Awards listing page loads correctly
- [ ] Individual award pages display properly
- [ ] Image gallery navigation works
- [ ] Document downloads function
- [ ] Responsive design on mobile devices
- [ ] Error handling for missing awards
- [ ] Loading states display correctly
- [ ] Navigation between pages works

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

### Required Packages
- `next` - React framework
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react-redux` - State management
- `@reduxjs/toolkit` - Redux toolkit

### CSS Framework
- `tailwindcss` - Utility-first CSS framework
- Custom CSS utilities for enhanced styling

## Deployment

### Build Process
1. Run `npm run build` to create production build
2. Ensure all API endpoints are accessible
3. Verify image uploads work in production
4. Test all award page functionality

### Environment Variables
- `API_BASE_URL` - Backend API URL
- Ensure proper CORS configuration for API calls

## Support

For issues or questions about this feature:
1. Check the browser console for errors
2. Verify API endpoints are responding
3. Ensure all dependencies are installed
4. Test with different award data

---

**Last Updated**: December 2024
**Version**: 1.0.0 