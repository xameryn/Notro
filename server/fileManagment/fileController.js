import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import Server from "../models/serverModel.js";
const fs = require('fs').promises;
const path = require('path');

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

// Delete File Handler
export const deleteFile = async (req, res) => {
  try {
    const fileID = req.params.fileID;
    console.log(`Deleting file: ${fileID}`);
    
    const file = await File.findByIdAndDelete(fileID);
    
    if (!file) {
      console.error(`File not found: ${fileID}`);
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.join(__dirname, '../files/', file._id, file.extension);
    console.log(`Deleting physical file at: ${filePath}`);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Error deleting physical file: ${err}`);
    }

    const thumbnails = file.thumbnails;

    for (const key in thumbnails) {
      const thumbnailPath = path.join(__dirname, thumbnails[key]);
      try {
        await fs.unlink(thumbnailPath);
      } catch (err) {
        console.error(`Error deleting thumbnail (${key}) file: ${err}`);
      }
    }
    
    console.log(`File deleted: ${fileID}`);
    return res.json({ message: "File deleted successfully" });
    
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};

// Fetch File by Name
export const getFileByName = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    console.log(`Fetching file with name: ${fileName}`);

    const file = await File.findOne({ name: fileName });

    if (!file) {
      console.error(`File not found: ${fileName}`);
      return res.status(404).json({ error: "File not found" });
    }

    console.log(`File found: ${file.name}`);
    return res.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Error fetching file" });
  }
};

export const getFileByBot = async (req, res) => {
  try {
    const { serverID, userID, fileName } = req.params;
    console.log(`Searching for file: ${fileName} in server: ${serverID} and user: ${userID}`);

    // First check server files
    const server = await Server.findById(serverID);
    if (server && server.fileList.length > 0) {
      // Fetch all File docs with matching IDs
      const files = await File.find({ _id: { $in: server.fileList } });
      const serverFile = files.find(file => file.name === fileName);

      if (serverFile) {
        console.log(`File found in server: ${serverFile.name}`);
        return res.json({
          success: true,
          file: serverFile,
          location: 'server'
        });
      }
    }

    // Then check user files
    const user = await User.findById(userID);
    if (user && user.fileList.length > 0) {
      const files = await File.find({ _id: { $in: user.fileList } });
      const userFile = files.find(file => file.name === fileName);

      if (userFile) {
        console.log(`File found in user files: ${userFile.name}`);
        return res.json({
          success: true,
          file: userFile,
          location: 'user'
        });
      }
    }

    console.log(`File ${fileName} not found in server or user files`);
    return res.status(404).json({
      success: false,
      error: "File not found",
      message: `${fileName} not found in server or user files`
    });

  } catch (error) {
    console.error("Error in getFileByBot:", error);
    return res.status(500).json({
      success: false,
      error: "Error searching for file",
      details: error.message
    });
  }
};