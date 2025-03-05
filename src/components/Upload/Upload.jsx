import React, { useRef } from 'react';
import './Upload.css';

const Upload = () => {
  const fileInputRef = useRef(null);

  const openFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  
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
          style={{ display: 'none' }}  
          ref={fileInputRef}           
        />
    </div>
  );
}

export default Upload;
