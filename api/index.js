const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes (use local api backend to avoid bundling root backend)
const authRoutes = require('./backend/src/routes/authRoutes');
const categoriesRoutes = require('./backend/src/routes/categoriesRoutes');
const FreeAudioRoutes = require('./backend/src/routes/freeAudio');
const PaidAudioRoutes = require('./backend/src/routes/paidAudio');
const SubcategoriesRoutes = require('./backend/src/routes/subCategoriesRoutes');
const CustomAudioRoutes = require('./backend/src/routes/CustomAudioRoutes');

// Initialize express app
const app = express();

// Increase payload limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedExactOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true; // allow same-origin/non-browser requests
  try {
    const { hostname, protocol } = new URL(origin);
    // Allow configured exact matches
    if (allowedExactOrigins.includes(origin)) return true;
    // Allow any *.vercel.app or *.vercel.dev over https
    const isVercelDomain =
      protocol === 'https:' && (hostname.endsWith('.vercel.app') || hostname.endsWith('.vercel.dev'));
    return isVercelDomain;
  } catch {
    return false;
  }
}

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Do not serve local uploads on Vercel; files are hosted on Cloudinary

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
// Support both singular and plural paths for compatibility
app.use('/api/free-audios', FreeAudioRoutes);
app.use('/api/free-audio', FreeAudioRoutes);
app.use('/api/paid-audios', PaidAudioRoutes);
app.use('/api/paid-audio', PaidAudioRoutes);
// Support hyphenated variant used by frontend
app.use('/api/subcategories', SubcategoriesRoutes);
app.use('/api/sub-categories', SubcategoriesRoutes);
app.use('/api/custom-audios', CustomAudioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Vercel serverless function handler
module.exports = (req, res) => app(req, res);
