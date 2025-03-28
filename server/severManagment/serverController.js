import User from "../models/userModel.js";
import Server from "../models/serverModel.js";

export const updateServerMemberList = async (req, res) => {
  try {
    const { serverID, userID } = req.body;

    // Check if both serverID and userID are provided
    if (!serverID || !userID) {
      return res.status(400).json({ success: false, error: "serverID and userID are required" });
    }

    // Find the server
    const server = await Server.findById(serverID);
    if (!server) {
      return res.status(404).json({ success: false, error: "Server not found" });
    }

    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if user is already in the member list, if not add them
    if (!server.memberList.includes(userID)) {
      server.memberList.push(userID);
      await server.save();
    }

    res.json({ success: true, message: "Member list updated", memberList: server.memberList });
  } catch (error) {
    console.error("Error updating server member list:", error);
    res.status(500).json({ success: false, error: "Error updating server member list" });
  }
};
