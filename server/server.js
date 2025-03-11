import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import process from 'process';
import fileRoutes from "./routes/fileRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import passport from "passport";
import session from "express-session";
import { Strategy as DiscordStrategy } from "passport-discord";
import authRoutes from "../src/discord-auth/auth-routes.js";

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
const originPorts = process.env.ORIGIN_PORT_RANGE || '5173,5174,5175';
const sessionSecret = process.env.SESSION_SECRET || "default_secret";

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

// Configure passport with Discord strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ["identify", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);

// Session management
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Serve files from the files/
app.use('/files', express.static(path.join(__dirname, 'files')));

// Use imported auth routes
app.use("/auth", authRoutes);

// Routes
app.use("/api", fileRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
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

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
