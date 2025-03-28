import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, uploadMetadata, getFilesByUser, getFilesByServer } from "./fileController.js";
import { generateThumbnails } from './fileHelper.js';

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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB in bytes
  }
});

// Route for uploading files to files/ directory and saving metadata to MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileResult = await uploadFile(req, res);
    if (!fileResult.success) {
      return res.status(400).json({ error: fileResult.error });
    }

    const { displayName, fileName, type, uploadDate, serverFile, tagList, size } = JSON.parse(req.body.metadata);

    const thumbnails = await generateThumbnails(req.file.path, type, req.fileId);

    const metadataReq = {
      body: {
        _id: req.fileId,
        name: displayName || fileName.split(".")[0],
        type: type.split("/")[0],
        extension: path.extname(fileName),
        uploadDate: new Date().toISOString(),
        serverFile: serverFile,
        tagList: tagList ? tagList.split(",") : [],
        thumbnails: thumbnails,
        size: size
      }
    };

    const metadataResult = await uploadMetadata(metadataReq);
    if (!metadataResult.success) {
      return res.status(500).json({ error: metadataResult.error });
    }

    res.json({
      message: 'File and metadata uploaded successfully',
      filename: req.file.filename,
      path: fileResult.path,
      metadata: metadataResult.file
    });

  } catch (error) {
    console.error("Error during file upload and metadata saving:", error);
    res.status(500).json({ error: "Error uploading file and saving metadata" });
  }
});

router.get("/files/user/:userID", getFilesByUser);

router.get("/files/server/:serverID", getFilesByServer);

export default router;
