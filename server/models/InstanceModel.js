// ### Instances:
// - id: (autogen, but shared server-side)
// - ownerID: (discord ID)
// - serverList: [server IDs]

import mongoose from "mongoose";

// Instance schema
const InstanceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Discord ID of the owner
  address: { type: String, required: true }, // Remote address of the instance (e.g., IP address or URL)
  serverList: [{ type: String, ref: "Server" }], // List of server IDs the instance is associated with
}, { versionKey: false, _id: false });

export default mongoose.model("Instance", InstanceSchema);
