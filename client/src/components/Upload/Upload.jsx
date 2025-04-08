import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useUser } from '../../contexts/UserContext';
import { useServer } from '../../contexts/ServerContext';
import './Upload.css';
import { Checkbox, FormControlLabel } from '@mui/material';

const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

const Upload = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverFile, setServerFile] = useState(false);
  const [tags, setTags] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { user, fetchUserFiles } = useUser();
  const { selectedServer, fetchServerFiles } = useServer();

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
      displayName: displayName || selectedFile.name.split('.')[0],
      fileName: selectedFile.name,
      type: selectedFile.type,
      tagList: tags,
      serverFile: serverFile,
      size: selectedFile.size, 
      userID: user.id,
      serverID: selectedServer.id
    };
  
    try {
      console.log("Starting upload with metadata:", fileMetadata);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("metadata", JSON.stringify(fileMetadata));
  
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
  
      const result = await response.json();
      console.log("Upload success result:", result);
  
      if (user?.id) {
        fetchUserFiles(true);
      }
      
      fetchServerFiles(true);
  
      toast.success("File successfully uploaded!", {
        position: "bottom-right",
        autoClose: 1000,
      });
  
      setSelectedFile(null);
      setDisplayName("");
      setTags("");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setDisplayName("");
    setTags("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  return (
      <div>
        {!selectedFile ? (
          <>
            <h1 className="upload-h1">Upload File</h1>
            <div className="file-upload-div" onClick={openFileBrowser} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => e.preventDefault()} onDrop={handleDrop}>
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={serverFile}
                  onChange={(e) => setServerFile(e.target.checked)}
                />
              }
              label="Server File"
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
