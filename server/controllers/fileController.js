import File from "../models/fileModel.js";

// Upload Handler (Metadata Only)
export const uploadFileMetadata = async (req, res) => {
  const { filename, size, mimetype, uploadDate, uploadedBy, accessLevel, sharedWith, tags, thumbnail, filePath } = req.body;

  if (!filename) {
    return res.status(400).json({ error: "Filename required" });
  }

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
