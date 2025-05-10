const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


// Load environment variables
dotenv.config();

const app = express();
const cookieParser = require('cookie-parser');

// Add these before your routes
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// Routes
const authRoutes = require("./Routes/auth");
const apiRoutes = require("./Routes/api"); 
const leaderboardRoutes = require('./Routes/leaderboard');

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/leaderboard", leaderboardRoutes); // Only mount once

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));