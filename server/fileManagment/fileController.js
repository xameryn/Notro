import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import Server from "../models/serverModel.js";

// Track recent requests to avoid duplicates
const recentRequests = new Map();

// File Upload Handler
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return { success: false, error: 'No file uploaded' };
    }
    
    return {
      success: true,
      filename: req.file.filename,
      path: `/files/${req.file.filename}`
    };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: 'Error uploading file' };
  }
};

// Metadata Upload Handler
export const uploadMetadata = async (req) => {
  try {
    const newFile = new File(req.body);
    const savedMetadata = await newFile.save();
    return { success: true, file: savedMetadata };
  } catch (error) {
    console.error("Error saving file metadata:", error);
    return { success: false, error: "Error saving file metadata" };
  }
};

// Add File to User Handler
export const addFileToUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const fileID = req.params.fileID;
    
    let user = await User.findById(userID);
    
    if (!user) {
      console.log(`User ${userID} not found!`);
      return res.status(404).json({ error: "User not found" });
    }

    if (user.fileList.includes(fileID)) {
      console.log(`File ${fileID} already exists in user ${userID}'s fileList`);
      return res.json({ message: "File already exists in user's fileList" });
    }

    user.fileList.push(fileID);
    await user.save();
    console.log(`Added file ${fileID} to ${userID}`);
    
    if (res && typeof res.json === 'function') {
      return res.json({ message: "File added to user successfully" });
    }
    
    return { success: true, message: "File added to user successfully" };
  } catch (error) {
    console.error("Error adding file to user:", error);
    
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ error: "Error adding file to user" });
    }
    
    return { success: false, error: "Error adding file to user" };
  }
};

// Add File to Server Handler
export const addFileToServer = async (req) => {
  try {
    const { serverID, fileID } = req.params;
    console.log(`Adding file ${fileID} to server ${serverID}`);

    const server = await Server.findById(serverID);
    if (!server) {
      return { success: false, error: "Server not found" };
    }

    server.fileList.push(fileID);
    await server.save();
    console.log(`Added file ${fileID} to ${serverID}`);

    return { success: true, message: "File added to server successfully" };
  } catch (error) {
    console.error("Error adding file to server:", error);
    return { success: false, error: "Error adding file to server" };
  }
};

// Fetch Files by User
export const getFilesByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const clientIP = req.ip;
    
    const now = Date.now();
    const recentRequest = recentRequests.get(userID);
    
    if (recentRequest && now - recentRequest.timestamp < 1000) { 
      console.log(`Duplicate request detected for user ${userID} (${recentRequest.count + 1}) - using cached response`);
      recentRequest.count++;

      // Use cached response if request sent within 1 second
      return res.json(recentRequest.response);
    }
    
    console.log("Processing request for user ID:", userID);
    
    const userFiles = await User.findOne({ _id: userID }).populate('fileList');
    
    let response = [];
    
    if (!userFiles) { // Might remove later, unsure if correct to do this
      console.log(`User ${userID} not found, creating new user entry`);
      const newUser = new User({
        _id: userID,
        fileList: []
      });
      await newUser.save();
    } else if (userFiles.fileList.length > 0) {
      response = userFiles.fileList;
    }
    
    recentRequests.set(userID, {
      timestamp: now,
      response: response,
      count: 1
    });
    
    // Clean up cache - attempt every 10 requests, if cache over 5 seconds old, purge
    if (recentRequests.size > 10) {
      const oldEntries = [];
      for (const [key, value] of recentRequests.entries()) {
        if (now - value.timestamp > 5000) {
          oldEntries.push(key);
        }
      }
      oldEntries.forEach(key => recentRequests.delete(key));
    }
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Error fetching user files" });
  }
};

// Fetch Servers in Database
export const getServersInDatabase = async (req, res) => {
  try {
    const servers = await Server.find({}, '_id name icon');
    if (!servers || servers.length === 0) return res.status(404).json({ error: "No servers found" });
    res.json(servers);
  } catch (error) {
    console.error("Error fetching servers:", error);
    res.status(500).json({ error: "Error fetching servers" });
  }
};

// Fetch Files by Server
export const getFilesByServer = async (req, res) => {
  try {
    const serverID = req.params.serverID;
    console.log(`Fetching files for server: ${serverID}`);
    
    const server = await Server.findOne({ _id: serverID }).populate('fileList');
    
    if (!server) {
      console.error(`Server not found: ${serverID}`);
      return res.status(404).json({ error: "Server not found" });
    }
    
    // Always return the fileList even if it's empty
    console.log(`Server found: ${server.name}, files: ${server.fileList.length}`);
    return res.json(server.fileList || []);
    
  } catch (error) {
    console.error("Error fetching server files:", error);
    res.status(500).json({ error: "Error fetching server files" });
  }
};