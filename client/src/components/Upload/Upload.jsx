import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useUser } from '../../contexts/UserContext';
import { useServer } from '../../contexts/ServerContext';
import './Upload.css';
import { Checkbox, FormControlLabel } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

const Upload = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverFile, setServerFile] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { user, fetchUserFiles } = useUser();
  const { selectedServer, fetchServerFiles } = useServer();
  const [previewUrl, setPreviewUrl] = useState(null);

  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
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
      tagList: tags.join(","),
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
        theme: "dark"
      });
  
      setSelectedFile(null);
      setDisplayName("");
      setTags([]);
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
    setTags([]);
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
              <div className="upload-container">

                <div
                  className="file-upload-div"
                  onClick={openFileBrowser}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                <div className="upload-header">
                  <AddCircleIcon className='upload-icon' />
                  <h3>Upload File</h3>
                </div>
                  <p>Click or drag-and-drop files here</p>
                </div>

                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

          </>
        ) : (
          <>
          <div className='upload-container'>
          <h3 className='enter-file-data-title'>Enter your file info:</h3>
          <div className="metadata-form">

          <div className='form-item'>
            <label>Selected file:</label>
              <div className="selected-file-div">
                <p>{selectedFile.name}</p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }} 
                />

                <AddCircleIcon className='upload-icon' onClick={openFileBrowser}/>
              </div>
              </div>
    
              <div className='form-item'>
            <label>Display Name:</label>
            <input
              type="text"
              placeholder="My file"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            </div>
    
            <div className='form-item'>
              <label>Tags:</label>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const newTag = tagInput.trim();
                    if (newTag && !tags.includes(newTag)) {
                      setTags([...tags, newTag]);
                    }
                    setTagInput("");
                  }
                }}
              />
              {Array.isArray(tags) && tags.length > 0 && (
                <div className="tag-container-large">
                  {tags.map((tag, index) => (
                    <div key={index} className="tag-bubble-medium">
                      #{tag}
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className='server-file-div'>
            <FormControlLabel
              className="upload-checkbox-label"
              control={
                <Checkbox
                  checked={serverFile}
                  onChange={(e) => setServerFile(e.target.checked)}
                  className="upload-checkbox"
                />
              }
              label="Server File"
            />
            </div>


            {previewUrl && selectedFile.type.startsWith('image/') && (
              <div className="image-preview-div">
                <img src={previewUrl} alt="Preview" className="image-preview" />
              </div>
            )}
    
            <div className='buttons-div'>
              <button onClick={uploadFile}>Upload</button>
              <button onClick={cancelUpload}>Cancel</button>
            </div>

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
