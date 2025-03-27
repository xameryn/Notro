// make a schema for users ID and fileList (list of file IDS)
// ### Users:
// - id: (pulled from discord)
// - fileList: [list of file IDs]

import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true }, // Discord user ID
  fileList: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // List of file IDs (references File model)
//   createdAt: { type: Date, default: Date.now }, // Timestamp when the user was created
//   updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

// Update the `updatedAt` field every time the document is saved
// UserSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

export default mongoose.model("User", UserSchema);
