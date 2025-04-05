import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import './Upload.css';

const API_URL = 'http://localhost:4000';

const Upload = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState("")
  const [displayName, setDisplayName] = useState("")

  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  };
  

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }
  
    setLoading(true);
  
    const fileMetadata = {
      displayName: displayName,
      fileName: selectedFile.name,
      type: selectedFile.type,
      tagList: tags,
      serverFile: true,
      size: selectedFile.size,
      uploadedBy: "", 
    };
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("metadata", JSON.stringify(fileMetadata));
  
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Upload failed");
  
      const result = await response.json();
  
      toast.success("File successfully uploaded!", {
        position: "bottom-right",
        autoClose: 1000,
      });
  
      console.log("Upload result:", result);
  
      setSelectedFile(null);
      setDisplayName("");
      setTags("");
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const cancelUpload = () => {
    setSelectedFile(null)
    setDisplayName("")
    setTags("")
  }

  return (
      <div>
        {!selectedFile ? (
          <>
            <h1 className="upload-h1">Upload File</h1>
            <div className="file-upload-div" onClick={openFileBrowser}>
              <p>Click here to upload a file</p>
            </div>
    
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />

          </>
        ) : (
          <>
          <h1 className="upload-h1">Upload File</h1>
          <div className="metadata-form">

            <label>Selected file:</label>
              <div className="selected-file-div">
                <p>{selectedFile.name}</p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }} 
                />

                <button onClick={openFileBrowser}>Change</button>
              </div>
    
            <label>Display Name:</label>
            <input
              type="text"
              placeholder="My file"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
    
            <label>Tags:</label>
            <input
              type="text"
              placeholder='#tag'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
    
            <div className='buttons-div'>
              <button onClick={uploadFile}>Upload</button>
              <button onClick={cancelUpload}>Cancel</button>
            </div>

          </div>
          </>
        )}
    
        {loading && <div className="loading-spinner">Uploading...</div>}
    
        <ToastContainer />
      </div>
      
    );
};

export default Upload;
