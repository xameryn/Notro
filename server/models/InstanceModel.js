// ### Instances:
// - id: (autogen, but shared server-side)
// - ownerID: (discord ID)
// - serverList: [server IDs]

import mongoose from "mongoose";

// Instance schema
const InstanceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Discord ID of the owner
  serverList: [{ type: String }], // List of server IDs the instance is associated with
//   createdAt: { type: Date, default: Date.now }, // Timestamp of when the instance was created
//   updatedAt: { type: Date, default: Date.now }, // Timestamp of when the instance was last updated
}, { versionKey: false });

// InstanceSchema.pre('save', function(next) {
//   this.updatedAt = Date.now(); // Update the `updatedAt` field on every save
//   next();
// });

export default mongoose.model("Instance", InstanceSchema);
