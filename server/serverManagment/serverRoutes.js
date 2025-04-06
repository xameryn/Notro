import express from "express";
import Instance from "../models/instanceModel.js";
import Server from "../models/serverModel.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is up and running",
    timestamp: new Date().toISOString()
  });
});

// Route: Connect a server to an instance and optionally add users to the server
router.post("/connect/:instanceID/:serverID", async (req, res) => {
  const { instanceID, serverID } = req.params;
  const { userList } = req.body; // Optional array of user IDs to add to the server

  try {
    // Fetch instance by ID
    const instance = await Instance.findById(instanceID);
    if (!instance) {
      return res.status(404).json({ success: false, error: "Instance not found" });
    }

    // Fetch server by ID
    const server = await Server.findById(serverID);
    if (!server) {
      return res.status(404).json({ success: false, error: "Server not found" });
    }

    // Add server to the instance's server list if it's not already connected
    if (!instance.serverList.includes(serverID)) {
      instance.serverList.push(serverID);
      await instance.save(); // Save updated instance
    }

    // If a userList is provided, add each user to the server's member list (if not already added)
    if (Array.isArray(userList)) {
      userList.forEach(userID => {
        if (!server.memberList.includes(userID)) {
          server.memberList.push(userID);
        }
      });
      await server.save(); // Save updated server
    }

    // Respond with success and the updated member list
    res.status(200).json({
      success: true,
      message: "Server successfully added to Instance",
      instanceID,
      serverID,
      userList: server.memberList
    });
  } catch (error) {
    console.error("Error connecting to Instance:", error);
    res.status(500).json({ success: false, error: "Error connecting to Instance" });
  }
});

export default router;
