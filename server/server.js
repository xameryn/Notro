import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

 // Load environment variables from .env
dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
