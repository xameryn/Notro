import express from "express";
import { Strategy as DiscordStrategy } from "passport-discord";
import authRoutes from "./auth-routes.js";
import "./passport-setup.js";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
const port = process.env.AUTH_PORT || 4001;
const sessionSecret = process.env.SESSION_SECRET;
const mongoURI = process.env.MONGO_URI;
const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected for Auth Server"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Configure CORS
app.use(cors({
  origin: clientURL,
  credentials: true
}));

// Setup session middleware with MongoDB store
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: mongoURI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 // 1 day in seconds
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      maxAge: 86400000, // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use imported auth routes
app.use("/auth", authRoutes);

// Basic status endpoint
app.get("/", (req, res) => {
  res.send("Discord Auth Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`🔐 Discord Auth Server running on http://localhost:${port}`);
});