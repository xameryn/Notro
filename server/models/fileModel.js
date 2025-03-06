import mongoose from "mongoose";

// set to false for basic testing
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: false }, // Original file name
  size: { type: Number, required: false }, // File size in bytes
  mimetype: { type: String, required: false }, // MIME type (image/png, application/pdf, etc.)
  uploadDate: { type: Date, default: Date.now }, // Auto-generated upload date
  uploadedBy: { type: String, required: false }, // Username of uploader
  visibility: { type: String, enum: ["personal", "server"], required: false }, // File access type
  tags: [{ type: String }], // List of tags/keywords
  thumbnail: { type: String }, // Path or URL to thumbnail image
  filePath: { type: String, required: false }, // Path or URL to the actual file location
});

export default mongoose.model("File", fileSchema);
