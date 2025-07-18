# MK Group Website - Admin System

A comprehensive admin system for managing MK Group's website content with bilingual support (Arabic/English), file uploads to AWS S3, and priority-based content management.

## Features

### Admin System
- **Authentication**: Secure admin login (no signup, admin account only)
- **Bilingual Support**: All content supports both Arabic and English
- **Content Management**: 
  - Projects (with budget, location, success partner, awards, attachments)
  - Partnerships (with partner information, links, attachments)
  - Awards (with attachments, priority)
  - Certifications (with attachments, priority)
  - News from Press (with attachments, priority)
- **File Uploads**: AWS S3 integration with image optimization and video compression
- **Priority System**: Content displayed based on priority (1-10)
- **SEO Optimized**: 100% SEO-friendly content presentation

### Technical Features
- **Ultra High Performance**: Node.js, Express, MongoDB with optimized queries
- **File Processing**: 
  - Image optimization (Sharp)
  - Video compression (FFmpeg)
  - Multiple file formats support
- **Security**: JWT authentication, rate limiting, CORS protection
- **Responsive Design**: Modern UI suitable for all devices

## Prerequisites

- Node.js 18+ 
- MongoDB 6+
- AWS S3 Account
- FFmpeg (for video processing)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mkgroup-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mkgroup-website

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mkgroup-website-uploads

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Server Configuration
PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# File Upload Limits
MAX_FILE_SIZE=100MB
MAX_VIDEO_SIZE=500MB
```

4. **Initialize Admin Account**
```bash
# Start the backend server
cd backend
npm run dev

# In another terminal, make a POST request to initialize admin
curl -X POST http://localhost:3001/api/auth/init
```

## Running the Application

### Development Mode
```bash
# Terminal 1: Start the backend server
cd backend
npm install
npm run dev

# Terminal 2: Start the frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm install
npm start

# Frontend
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `POST /api/auth/logout` - Logout
- `POST /api/auth/init` - Initialize admin account

### Projects
- `GET /api/projects/admin` - Get all projects (admin)
- `GET /api/projects/public` - Get published projects (public)
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/status` - Update status
- `PATCH /api/projects/:id/priority` - Update priority

### Partnerships
- `GET /api/partnerships/admin` - Get all partnerships (admin)
- `GET /api/partnerships/public` - Get published partnerships (public)
- `POST /api/partnerships` - Create partnership
- `PUT /api/partnerships/:id` - Update partnership
- `DELETE /api/partnerships/:id` - Delete partnership

### Awards
- `GET /api/awards/admin` - Get all awards (admin)
- `GET /api/awards/public` - Get published awards (public)
- `POST /api/awards` - Create award
- `PUT /api/awards/:id` - Update award
- `DELETE /api/awards/:id` - Delete award

### Certifications
- `GET /api/certifications/admin` - Get all certifications (admin)
- `GET /api/certifications/public` - Get published certifications (public)
- `POST /api/certifications` - Create certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification

### News
- `GET /api/news/admin` - Get all news (admin)
- `GET /api/news/public` - Get published news (public)
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### File Uploads
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:filename` - Delete file
- `GET /api/upload/limits` - Get upload limits

## Admin Interface

### Access
- URL: `http://localhost:3000/admin`
- Default credentials: `admin` / `admin123`

### Features
- **Dashboard**: Overview with statistics and recent content
- **Content Management**: Create, edit, delete all content types
- **File Management**: Upload and manage attachments
- **Bilingual Editor**: Toggle between Arabic and English content
- **Priority Management**: Set content priority (1-10)
- **Status Control**: Draft, Published, Archived states

## Content Structure

### Projects
**Required (1):**
- Title (EN/AR)
- Summary (EN/AR)
- Description (EN/AR)
- Attachments

**Optional (2):**
- Budget (amount, currency, EN/AR)
- Location (EN/AR, coordinates)
- Success Partner (EN/AR)
- Awards
- Priority

### Partnerships
**Required (1):**
- Title (EN/AR)
- Summary (EN/AR)
- Description (EN/AR)
- Partner Information (EN/AR)
- Attachments

**Optional (2):**
- Partner Links
- Priority

### Awards
**Required (1):**
- Title (EN/AR)
- Summary (EN/AR)
- Description (EN/AR)
- Attachments

**Optional (2):**
- Priority

### Certifications
**Required (1):**
- Title (EN/AR)
- Summary (EN/AR)
- Description (EN/AR)
- Attachments

**Optional (2):**
- Priority

### News
**Required (1):**
- Title (EN/AR)
- Summary (EN/AR)
- Description (EN/AR)
- Attachments

**Optional (2):**
- Priority

## File Upload Support

### Supported Formats
- **Images**: JPEG, PNG, WebP, GIF
- **Videos**: MP4, AVI, MOV, WMV, FLV
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT

### Processing
- **Images**: Automatic optimization and resizing
- **Videos**: Compression to 720p with optimized bitrate
- **Storage**: AWS S3 with CDN support

## Performance Optimizations

### Database
- Indexed queries for priority and status
- Text search indexes for bilingual content
- Aggregation pipelines for statistics

### File Processing
- Image optimization with Sharp
- Video compression with FFmpeg
- Lazy loading for attachments
- CDN integration for fast delivery

### Frontend
- React with Next.js 15
- Tailwind CSS for styling
- Optimized bundle size
- Responsive design

## Security Features

- JWT-based authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization
- Secure file upload validation
- Helmet.js security headers

## Deployment

### Backend (Express Server)
```bash
# Install PM2 for production
npm install -g pm2

# Start with PM2
pm2 start server/index.js --name "mkgroup-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Frontend (Next.js)
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
AWS_ACCESS_KEY_ID=your-production-aws-key
AWS_SECRET_ACCESS_KEY=your-production-aws-secret
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-production-bucket
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env.local`

2. **AWS S3 Upload Errors**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure bucket exists

3. **FFmpeg Not Found**
   - Install FFmpeg: `npm install ffmpeg-static`
   - For Linux: `sudo apt-get install ffmpeg`

4. **Admin Login Issues**
   - Initialize admin account: `POST /api/auth/init`
   - Check JWT_SECRET in environment

### Logs
- Backend logs: Check terminal running `npm run dev:server`
- Frontend logs: Check browser console
- File upload logs: Check server console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for MK Group.

## Support

For technical support, contact the development team.
