import React, { useRef } from 'react';
import './Upload.css';

const Upload = () => {
  const fileInputRef = useRef(null);

  // Trigger the file input click
  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the first file
    if (!file) return; // If no file selected, return
  
    const formData = new FormData(); // Create a new FormData object
    formData.append("file", file); // Append the file to FormData
  
    try {
      const response = await fetch("http://localhost:5137/api/upload", {
        method: "POST",
        body: formData, // Pass the FormData object as the body
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("File uploaded successfully!");
        console.log(result); // Optionally handle response
      } else {
        alert("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };  

  return (
    <div>
      <h1 className='upload-h1'>Upload a File</h1>
      <div className='file-upload-div' onClick={openFileBrowser}>
        <p>Click or drag files here</p>
      </div>

      <input
        type="file"
        style={{ display: 'none' }}  // Hide the input
        ref={fileInputRef}
        onChange={handleFileChange}  // Handle file selection
      />
    </div>
  );
}

export default Upload;
