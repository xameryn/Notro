import express from "express";
import { uploadFileMetadata, getFiles } from "../controllers/fileController.js";

const router = express.Router();

// Route for uploading file metadata
router.post("/metadata", uploadFileMetadata); 

// Route to fetch all files (or files based on certain criteria like visibility)
router.get("/files", getFiles);

export default router;
