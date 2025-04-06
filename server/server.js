import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import process from 'process';
import fileRoutes from "./fileManagment/fileRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create files/ if it doesn't exist
const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir, { recursive: true });
}

const app = express();
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 4000;
const authServerUrl = process.env.AUTH_SERVER_URL || 'http://localhost:4001';
const originPorts = process.env.ORIGIN_PORT_RANGE || '5173';

// Middleware
const allowedOrigins = originPorts.split(',').map(port => 
  `http://localhost:${port.trim()}`
);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve files from the files/
app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes
app.use("/api", fileRoutes);

// Authentication requests to the auth server
app.get("/auth/*", (req, res) => {
  res.redirect(`${authServerUrl}${req.originalUrl}`);
});

app.get("/", (req, res) => {
  res.send("File Server is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  console.error("Stack:", err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message
  });
});

// Connect to MongoDB with improved error handling
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

app.listen(port, () => console.log(`🚀 File Server running on http://localhost:${port}`));
