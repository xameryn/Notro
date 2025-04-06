// ### Servers:
// - id: (pulled from discord)
// - adminList: [user IDs]
// - memberList: [user IDs]
// - fileList: [list of file IDs]

import mongoose from "mongoose";

// Server Schema
const ServerSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Discord server ID
  name: { type: String, required: true }, // Server name
  icon: { type: String }, // Server icon URL/hash
  adminList: [{ type: String, required: true, ref: "User" }], // List of user IDs (admin role)
  memberList: [{ type: String, required: true, ref: "User" }], // List of user IDs (members)
  fileList: [{ type: String, ref: "File" }], // List of file IDs (references File model)
}, { versionKey: false, _id: false });

export default mongoose.model("Server", ServerSchema);
