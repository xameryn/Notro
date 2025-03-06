import File from "../models/fileModel.js";
import multer from "multer";
// import sharp from "sharp"; // For generating thumbnails
import fs from "fs";

// Configure Multer (stores files in "uploads/")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/"); // Files are stored in the "server/uploads/" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generates a unique filename using the current timestamp
  },
});

const upload = multer({ storage }).single("file");

// Upload Handler
export const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    const { originalname, mimetype, size, path } = req.file;
    const { uploadedBy, visibility, tags } = req.body;

    try {
      // Generate a thumbnail for images
    //   let thumbnailPath = "";
    //   if (mimetype.startsWith("image/")) {
    //     const thumbPath = `server/uploads/thumbnails/${Date.now()}-thumb.png`;
    //     await sharp(path).resize(200, 200).toFile(thumbPath);
    //     thumbnailPath = thumbPath;
    //   }

      // Define the file path (where the file is stored)
      const filePath = `/uploads/${req.file.filename}`;

      // Save metadata in MongoDB
      const newFile = new File({
        filename: originalname,
        size,
        mimetype,
        uploadedBy,
        visibility,
        tags: tags ? tags.split(",") : [], // Convert comma-separated tags into an array
        thumbnail: thumbnailPath,
        filePath: filePath, // Store the path to the file's location
      });

      await newFile.save();
      res.json({ message: "File uploaded successfully!", file: newFile });
    } catch (error) {
      res.status(500).json({ error: "Error saving file metadata" });
    }
  });
};

// Fetch All Files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Error fetching files" });
  }
};
