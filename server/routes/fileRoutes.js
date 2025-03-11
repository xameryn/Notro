import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFileMetadata, getFiles } from "../controllers/fileController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


// TODO - check if name exists in files/, if so +1 after dash (ie. ms-1 > ms-2) to allow for multiple files uploaded in the same millisecond (unless better way to handle this)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../files/'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
  }
});

const upload = multer({ storage: storage });

// TODO - add file data to db alonside file upload
router.post('/upload', upload.single('file'), (req, res) => {
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
  }
});

// Route for uploading file metadata
router.post("/metadata", uploadFileMetadata); 

// Route to fetch all files (or files based on certain criteria like visibility)
router.get("/files", getFiles);

export default router;
