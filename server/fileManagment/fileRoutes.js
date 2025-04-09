import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, uploadMetadata, addFileToUser, addFileToServer, getServersInDatabase, getFilesByUser, getFilesByServer, deleteFile } from "./fileController.js";
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
    console.log("Upload request received");
    
    const fileResult = await uploadFile(req, res);
    if (!fileResult.success) {
      return res.status(400).json({ error: fileResult.error });
    }
    
    console.log("File uploaded to disk successfully");
    
    // Parse the metadata from the request body
    let metadata;
    try {
      metadata = JSON.parse(req.body.metadata);
      console.log("Metadata parsed:", metadata);
    } catch (parseError) {
      console.error("Error parsing metadata:", parseError);
      return res.status(400).json({ error: "Invalid metadata format" });
    }
    
    const { displayName, fileName, type, serverFile, tagList, size, userID, serverID } = metadata;
    
    try {
      await generateThumbnails(req.file.path, type, req.fileId);
      console.log("Thumbnails generated");
      
      const metadataReq = {
        body: {
          _id: req.fileId,
          name: displayName || fileName.split(".")[0],
          type: type.split("/")[0],
          extension: path.extname(fileName),
          uploadDate: new Date().toISOString(),
          serverFile: serverFile || false,
          tagList: tagList ? tagList.split(",").map(tag => tag.trim()) : [],
          size: size
        }
      };
      
      const metadataResult = await uploadMetadata(metadataReq);
      console.log("Metadata saved to database");
      
      if (!metadataResult.success) {
        return res.status(500).json({ error: metadataResult.error });
      }
      
      // Add file to user's fileList if userID is provided
      if (userID) {
        
        try {
          const userFileReq = {
            params: {
              userID: userID,
              fileID: req.fileId
            }
          };
          
          const userResult = await addFileToUser(userFileReq);
          console.log("Add file to user result:", userResult);
          
          if (!userResult.success) {
            console.error("Error adding file to user:", userResult.error);
          }
        } catch (userError) {
          console.error("Exception adding file to user:", userError);
        }
      }

      console.log("req ID:", req.fileId);
      console.log("serverID:", serverID);

      // Add file to server's fileList if serverFile is true and serverID is provided
      if (serverFile) {
        try {
          const serverFileReq = {
            params: {
              serverID: serverID,
              fileID: req.fileId
            }
          };
          
          const serverResult = await addFileToServer(serverFileReq);
          console.log("Add file to server result:", serverResult);
          
          if (!serverResult.success) {
            console.error("Error adding file to server:", serverResult.error);
          }
        } catch (serverError) {
          console.error("Exception adding file to server:", serverError);
        }
      }
      
      return res.json({
        message: 'File and metadata uploaded successfully',
        filename: req.file.filename,
        path: fileResult.path,
        metadata: metadataResult.file
      });
      
    } catch (thumbnailError) {
      console.error("Error generating thumbnails:", thumbnailError);
      return res.status(500).json({ error: "Error generating thumbnails" });
    }
    
  } catch (error) {
    console.error("Error in upload route:", error);
    return res.status(500).json({ error: "Error uploading file and saving metadata" });
  }
});

router.get("/servers", getServersInDatabase)

router.get("/files/user/:userID", getFilesByUser);

router.get("/files/server/:serverID", getFilesByServer);

router.delete("/files/:fileID", deleteFile);

export default router;
