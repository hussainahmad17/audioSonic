require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./src/config/db");
const { errorHandler } = require("./src/middlewares/errorMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const categoriesRoutes = require('./src/routes/categoriesRoutes');
const FreeAudioRoutes = require('./src/routes/freeAudio');
const PaidAudioRoutes = require('./src/routes/paidAudio');
const SubcategoriesRoutes = require('./src/routes/subCategoriesRoutes')
const CustomAudioRoutes = require('./src/routes/CustomAudioRoutes')
// Add pagination plugin to mongoose
const mongoose = require('mongoose');
mongoose.plugin(require('mongoose-paginate-v2'));

// Connect to database
connectDB();

const app = express();

/* ---------- Global Middlewares ---------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN,
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Increase payload limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ---------- Static Files ---------- */
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/free-audios', express.static('uploads/free-audio'));
app.use('/free-audios', express.static(path.join(__dirname, 'uploads/free-audio')));
app.use('/paid-audios', express.static(path.join(__dirname, 'uploads/paid-audio')));

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes)
app.use("/api/sub-categories", SubcategoriesRoutes)
app.use("/api/free-audio", FreeAudioRoutes);
app.use("/api/paid-audio", PaidAudioRoutes);
app.use("/api/custom-audio", CustomAudioRoutes);
// app.use("/api/reports", ReportRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/* ---------- Error Handler ---------- */
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
});