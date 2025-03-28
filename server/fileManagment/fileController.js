import File from "../models/fileModel.js";

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
