import mongoose from "mongoose";

// set to false for basic testing
const fileSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // File UUID
  name: { type: String, required: true }, // Chosen file name
  type: { type: String, required: true }, // MIME type (image, application, etc.)
  extension: { type: String, required: true }, // File extension (jpg, png, pdf, etc.)
  uploadDate: { type: Date, default: Date.now }, // Auto-generated upload date
  serverFile: { type: Boolean, default: false }, // anyone in the serverList can use it
  tagList: [{ type: String }], // List of tags/keywords
  thumbnails: {
    small: { type: String, default: '' },
    medium: { type: String, default: '' },
    large: { type: String, default: '' },
  }, // Thumbnail Paths
  size: { type: Number, required: true }, // File size in bytes  
}, { versionKey: false });

export default mongoose.model("File", fileSchema);
