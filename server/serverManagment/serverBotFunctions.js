import mongoose from "mongoose";
import File from "../models/fileModel.js";


// To get files specific files by ID
export const getFileById = async (req, res) => {
  try {
    const { fileID } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(fileID)) {
      return res.status(400).json({ success: false, error: "Invalid file ID format" });
    }

    // Find the file
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    res.json({ success: true, file });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

