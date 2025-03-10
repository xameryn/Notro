import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;
const originPort = process.env.ORIGIN_PORT

// Middleware
app.use(cors({ origin: `http://localhost:${originPort}` }));
app.use(express.json());

// Routes
app.use("/api", fileRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Connect to MongoDB with improved error handling
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
