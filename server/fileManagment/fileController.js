import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import Server from "../models/serverModel.js";

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

// Fetch All Files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Error fetching files" });
  }
};

// Fetch Files by User
export const getFilesByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const userFiles = await User.findOne({ userID: userID }).populate('fileList');
    if (!userFiles) return res.status(404).json({ error: "User not found" });
    if (userFiles.fileList.length === 0) return res.status(404).json({ error: "No files found for this user" });
    res.json(userFiles.fileList);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Error fetching user files" });
  }
};

// Fetch Files by Server
export const getFilesByServer = async (req, res) => {
  try {
    const serverID = req.params.serverID;
    const serverFiles = await Server.findOne({ serverID: serverID }).populate('fileList');
    if (!serverFiles) return res.status(404).json({ error: "Server not found" });
    if (serverFiles.fileList.length === 0) return res.status(404).json({ error: "No files found for this server" });
    res.json(serverFiles.fileList);
  } catch (error) {
    console.error("Error fetching server files:", error);
    res.status(500).json({ error: "Error fetching server files" });
  }
};