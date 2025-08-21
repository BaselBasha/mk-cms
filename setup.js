#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 MK Group Website - Admin System Setup');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env.local file...");

  const envContent = `# Database
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
PORT=3000
NEXT_PUBLIC_API_URL=https://mk-cms-back.vercel.app/api

# File Upload Limits
MAX_FILE_SIZE=100MB
MAX_VIDEO_SIZE=500MB
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env.local created successfully!");
  console.log(
    "⚠️  Please update the AWS credentials and JWT_SECRET in .env.local\n"
  );
} else {
  console.log("✅ .env.local already exists\n");
}

// Check if MongoDB is running
console.log("🔍 Checking MongoDB connection...");
const { MongoClient } = require("mongodb");

async function checkMongoDB() {
  try {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    console.log("✅ MongoDB is running and accessible");
    await client.close();
  } catch (error) {
    console.log("❌ MongoDB connection failed");
    console.log("💡 Please ensure MongoDB is running on localhost:27017");
    console.log("   You can start MongoDB with: mongod\n");
  }
}

// Check if all required packages are installed
console.log("📦 Checking dependencies...");
const packageJson = require("./package.json");
const requiredDeps = [
  "express",
  "mongoose",
  "aws-sdk",
  "bcryptjs",
  "jsonwebtoken",
  "multer",
  "sharp",
  "ffmpeg-static",
  "fluent-ffmpeg",
  "uuid",
];

const missingDeps = requiredDeps.filter(
  (dep) => !packageJson.dependencies[dep]
);

if (missingDeps.length > 0) {
  console.log("❌ Missing dependencies:", missingDeps.join(", "));
  console.log("💡 Run: npm install\n");
} else {
  console.log("✅ All required dependencies are installed\n");
}

// Setup instructions
console.log("📋 Setup Instructions:");
console.log("=====================");
console.log("");
console.log("1. Update .env.local with your AWS credentials and JWT_SECRET");
console.log("2. Start MongoDB: mongod");
console.log("3. Install dependencies: npm install");
console.log("4. Install backend dependencies: cd backend && npm install");
console.log("5. Start the backend server: cd backend && npm run dev");
console.log(
  "6. Initialize admin account: curl -X POST http://localhost:3000/api/auth/init"
);
console.log('7. Start the frontend: npm run dev');
console.log('8. Access admin panel: http://localhost:3000/admin');
console.log('   Default credentials: admin / admin123');
console.log('');
console.log('🎉 Setup complete! Happy coding!');

// Run MongoDB check
checkMongoDB().catch(console.error); 