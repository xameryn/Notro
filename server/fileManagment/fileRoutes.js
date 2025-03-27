import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, uploadMetadata, getFiles } from "./fileController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../files/'))
  },
  filename: function (req, file, cb) {
    const fileId = uuidv4();
    req.fileId = fileId;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${fileId}${fileExtension}`);
  }
});

const upload = multer({ storage: storage });

// Route for uploading files to files/ directory and saving metadata to MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
      await uploadFile(req, res); // Upload the file

      const { filename, size, fileType, uploadDate, uploadedBy, accessLevel, sharedWith, tags, thumbnail } = JSON.parse(req.body.metadata);
      
      const fileExtension = path.extname(req.file.originalname);
      const filePath = `/files/${req.fileId}${fileExtension}`;

      const metadataReq = {
        body: {
          filename: filename,
          size: size,
          filetype: fileType,
          uploadDate: uploadDate,
          uploadedBy: uploadedBy,
          accessLevel: accessLevel,
          sharedWith: sharedWith,
          tags: tags,
          thumbnail: thumbnail,
          filePath: filePath
        }
      };

      // Call uploadFileMetadata to save metadata to MongoDB
      await uploadMetadata(metadataReq, res);

  } catch (error) {
      console.error("Error during file upload and metadata saving:", error);
      res.status(500).json({ error: "Error uploading file and saving metadata" });
  }
});

// Route to fetch all files (or files based on certain criteria like visibility)
router.get("/files", getFiles);

export default router;
