import mongoose from "mongoose";

// set to false for basic testing
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: false }, // Original file name
  filePath: { type: String, required: false }, // Path or URL to the actual file location
  filetype: { type: String, required: false }, // MIME type (image/png, application/pdf, etc.)
  uploadDate: { type: Date, default: Date.now }, // Auto-generated upload date
  serverFile: { type: Boolean, default: false }, // anyone in the serverList can use it
  tagList: [{ type: String }], // List of tags/keywords
  thumbnail: { type: String }, // Path or URL to thumbnail image
  size: { type: Number, required: false }, // File size in bytes  
});

export default mongoose.model("File", fileSchema);
