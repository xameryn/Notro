import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import './Upload.css';

// Dummy test file metadata
// const testFileMetadata = {
//   filename: "deez.txt",
//   size: 2048, // Size in bytes (2KB)
//   mimetype: "text/plain",
//   uploadDate: new Date(),
//   uploadedBy: "TestUser",
//   accessLevel: "public",
//   sharedWith: [],
//   tags: ["test", "example"],
//   thumbnail: null,
//   filePath: "/filepath/deez.txt", // Example file path
// };

// Metadata should be handled in the server backend and sent to db from there in my opinion

const API_URL = 'http://localhost:4000';

const Upload = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Trigger the file input click
  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file); // Changed from fileName to 'file'

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success("File successfully uploaded!", {
        position: "bottom-right", 
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: false,
        pauseOnHover: false,
      });
      console.log(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="upload-h1">Upload File</h1>
      <div className="file-upload-div" onClick={openFileBrowser}>
        <p>Click or drag files here</p>
      </div>

      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {loading && <div className="loading-spinner">Uploading...</div>}
      <ToastContainer />
    </div>
  );
};

export default Upload;
