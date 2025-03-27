import File from "../models/fileModel.js";

// File Upload Handler
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: `/files/${req.file.filename}`
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
};

// Metadata Upload Handler
export const uploadMetadata = async (req, res) => {
  const { filename, size, mimetype, uploadDate, uploadedBy, accessLevel, sharedWith, tags, thumbnail, filePath } = req.body;

  try {
    // Save metadata in MongoDB
    const newFile = new File({
      filename,
      size,
      mimetype,
      uploadDate,
      uploadedBy,
      accessLevel,
      sharedWith,
      tags: tags ? tags.split(",") : [], // Convert comma-separated tags into an array
      thumbnail, // path or url of thumbnail
      filePath, // Store file path instead of the actual file
    });

    await newFile.save();
    res.json({ message: "File metadata saved successfully!", file: newFile });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ error: "Error saving file metadata" });
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
