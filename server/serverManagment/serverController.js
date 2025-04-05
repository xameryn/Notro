import User from "../models/userModel.js";
import Server from "../models/serverModel.js";
import Instance from "../models/instanceModel.js";

// To refresh the member list as needed
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

// Controller function to connect a server to an instance
export const connectServerToInstance = async (req, res) => {
  // Extract instance and server IDs from route parameters
  const { instanceID, serverID } = req.params;

  // Optional: list of user IDs to add to the server's member list
  const { userList } = req.body;

  // Validate that both IDs are proper MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(instanceID) || !mongoose.Types.ObjectId.isValid(serverID)) {
    return res.status(400).json({ success: false, error: "Invalid instance or server ID format" });
  }

  try {
    // Fetch the instance document from the database
    const instance = await Instance.findById(instanceID);
    if (!instance) {
      // If not found, return 404
      return res.status(404).json({ success: false, error: "Instance not found" });
    }

    // Fetch the server document from the database
    const server = await Server.findById(serverID);
    if (!server) {
      // If not found, return 404
      return res.status(404).json({ success: false, error: "Server not found" });
    }

    // Add server to the instance's serverList if it's not already connected
    if (!instance.serverList.includes(serverID)) {
      instance.serverList.push(serverID);
      await instance.save(); // Save the updated instance
    }

    // If a user list is provided, try to add each user to the server's member list
    if (Array.isArray(userList)) {
      // Create a Set of existing member IDs for quick lookup
      const existingUsers = new Set(server.memberList.map(id => id.toString()));

      // Filter out userIDs that are already in the member list
      const newUsers = userList.filter(userID => !existingUsers.has(userID));

      // If there are new users to add, update the server's member list
      if (newUsers.length > 0) {
        server.memberList.push(...newUsers); // Add all new users at once
        await server.save(); // Save the updated server
      }
    }

    // Respond with a success message and updated member list
    res.status(200).json({
      success: true,
      message: "Server successfully connected to Instance",
      instanceID,
      serverID,
      updatedMemberList: server.memberList,
    });
  } catch (error) {
    // Catch and log any unexpected errors
    console.error("Error connecting to Instance:", error);
    res.status(500).json({ success: false, error: "Error connecting to Instance" });
  }
};
