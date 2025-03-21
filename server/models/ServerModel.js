// ### Servers:
// - id: (pulled from discord)
// - adminList: [user IDs]
// - memberList: [user IDs]
// - fileList: [list of file IDs]

import mongoose from "mongoose";

// Server Schema
const ServerSchema = new mongoose.Schema({
  serverID: { type: String, required: true, unique: true }, // Discord server ID
  adminList: [{ type: String, required: true }], // List of user IDs (admin role)
  memberList: [{ type: String, required: true }], // List of user IDs (members)
  fileList: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // List of file IDs (references File model)
  createdAt: { type: Date, default: Date.now }, // Timestamp when the server entry is created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

// Update the `updatedAt` field every time the document is saved
ServerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Server", ServerSchema);
