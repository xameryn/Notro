import React, { useRef, useState } from 'react';
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
    const file = e.target.files[0]; // Get the selected file
    if (!file) return;

    // Extract metadata
    const fileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch(`http://localhost:5137/api/metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileMetadata),
      });

      if (!response.ok) {
        // Throw an error if the response status is not 2xx
        throw new Error(`Failed to share metadata: ${response.statusText}`);
      }

      const result = await response.json();
      alert("File metadata shared successfully!");
      console.log(result); // Optionally handle the response
    } catch (error) {
      console.error("Error sharing metadata:", error);
      alert(`Error sharing metadata: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading
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
    </div>
  );
};

export default Upload;
