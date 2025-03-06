import express from "express";
import { uploadFile, getFiles } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", uploadFile); // Upload file data
router.get("/files", getFiles); // Fetch file metadata

export default router;
