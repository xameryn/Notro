// import mongoose from "mongoose";
// import File from "../models/fileModel.js";


// // To get files specific files by ID
// export const getFileById = async (req, res) => {
//   try {
//     const { fileID } = req.params;

//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(fileID)) {
//       return res.status(400).json({ success: false, error: "Invalid file ID format" });
//     }

//     // Find the file
//     const file = await File.findById(fileID);
//     if (!file) {
//       return res.status(404).json({ success: false, error: "File not found" });
//     }

//     res.json({ success: true, file });
//   } catch (error) {
//     console.error("Error fetching file:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

// // Get metadata for all files
// export const getAllFilesMetadata = async (req, res) => {
//   try {
//     // Fetch all files, exclude large fields like file data if present
//     const files = await File.find({}, '-__v'); // Exclude __v field

//     res.json({ success: true, files });
//   } catch (error) {
//     console.error("Error fetching files metadata:", error);
//     res.status(500).json({ success: false, error: "Internal server error" });
//   }
// };

// ====================================
// ====================================

import mongoose from "mongoose";
import File from "../models/fileModel.js";


// Modify this function to remove req and res and return the file directly
export const getFileById = async (fileID) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(fileID)) {
      return { success: false, error: "Invalid file ID format" };
    }

    // Find the file
    const file = await File.findById(fileID);
    if (!file) {
      return { success: false, error: "File not found" };
    }

    return { success: true, file }; // Return file and success flag
  } catch (error) {
    console.error("Error fetching file:", error);
    return { success: false, error: "Internal server error" };
  }
};
export default getFileById;

// Get metadata for all files
export const getAllFilesMetadata = async (req, res) => {
  try {
    // Fetch all files, exclude large fields like file data if present
    const files = await File.find({}, '-__v'); // Exclude __v field

    res.json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files metadata:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};