import Instance from "../models/instanceModel.js";
import Server from "../models/serverModel.js";

router.post("/connect/:instanceID/:serverID", async (req, res) => {
  const { instanceID, serverID } = req.params;
  const { userList } = req.body; // if you want to include memberlist

  try {
    // Validate the instance and server
    const instance = await Instance.findById(instanceID);
    if (!instance) {
      return res.status(404).json({ success: false, error: "Instance not found" });
    }

    const server = await Server.findById(serverID);
    if (!server) {
      return res.status(404).json({ success: false, error: "Server not found" });
    }

    // Ensure the server is connected to the instance
    if (!instance.serverList.includes(serverID)) {
      instance.serverList.push(serverID);
      await instance.save();
    }

    // Optionally add users to the server's member list
    if (Array.isArray(userList)) {
      userList.forEach(userID => {
        if (!server.memberList.includes(userID)) {
          server.memberList.push(userID);
        }
      });
      await server.save();
    }

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

// left here for reference
// router.post("/connect/:instanceID/:serverID", async (req, res) => {
//     const { instanceID, serverID, userList } = req.params;
  
//     try {
//       // add function to connect server to the instance
//       res.status(200).json({ message: "Server successfully added to Instance", fileId, instanceID, serverID });
//     } catch (error) {
//       console.error("Error connecting to Instance:", error);
//       res.status(500).json({ error: "Error connecting to Instance" });
//     }
// });