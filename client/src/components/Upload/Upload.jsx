import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import './Upload.css';
import { useFileRefs } from '../../contexts/FileRefsContext';

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
  const { setFileRefs } = useFileRefs();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState("")
  // const [serverFile, setServerFile] = useState(true)
  const [displayName, setDisplayName] = useState("")
  // thumbnails to be added once we start dealing with video/audio files
  // const [thumbnail, setThumbnail] = useState(null)

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
      displayName: displayName,              // user-defined display name
      fileName: selectedFile.name,           // original file name
      type: selectedFile.type,               // mime type
      tagList: tags,                         // user-defined tags
      serverFile: true,                      // anyone in the serverList can use it
      size: selectedFile.size,               // file size in bytes
      uploadedBy: "",                        // user who uploaded the file
    };

    console.log("metadata", fileMetadata);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("metadata", JSON.stringify(fileMetadata)); 

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

      toast.success("File successfully uploaded!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });

      const result = await response.json();

      console.log('path:', result.path)

      fileMetadata.filePath = result.path  // add the correct filepath with the actual saved file name

      const fileMetadataJSON = JSON.stringify(fileMetadata)

      setFileRefs((prevRefs) => [...prevRefs, fileMetadataJSON]); 

      console.log('result', result)

      setSelectedFile(null);
      setDisplayName("");
      setTags("");

    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
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
