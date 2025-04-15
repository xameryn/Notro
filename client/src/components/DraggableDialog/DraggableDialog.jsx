import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Button, Typography, Box } from '@mui/material';
import Draggable from 'react-draggable';
import './DraggableDialog.css'
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';

const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

// The majority of this code is pasted directly from the MUI website
// I used the "Draggable Dialog" component from this page: https://mui.com/material-ui/react-dialog/
// I added onto the original code to add additional features (e.g. "Copy URL" and "Download" buttons)
// I also changed the DraggableDialog function to accept a file as a parameter and to display relevant info about it (just the file name for now)

function getFilePath(file) {
  return `${apiUrl}/files/${file._id}${file.extension}`;
}

function getThumbnail(file) {
  if (file.type === 'image' || file.type ==='video')
    return `${apiUrl}/files/thumbnails/${file._id}_thumb_medium.jpg`;
  else if (file.type === 'application')
    return `${apiUrl}/files/assets/document.png`;
  else
    return `${apiUrl}/files/assets/unknown.png`;
}


function DraggableDialog({ file, showTags = true, showFileName = true, fetchServerFiles }) {
  const [open, setOpen] = React.useState(false);

  const filePath = getFilePath(file)
  const mediumThumbnailPath = getThumbnail(file)

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = () => {
    fetch(`${apiUrl}/files/${file._id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        console.log('File deleted successfully');
        toast.success("File deleted successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
        });
        handleClose();
      } else {
        console.error('Error deleting file:', response.statusText);
        toast.error("Error deleting file!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    })
  };

  const copyURL = () => {
    const fileLink = `${apiUrl}/files/${file._id}${file.extension}`;
    navigator.clipboard.writeText(fileLink)
      .then(() => {
        toast.success("File link copied!", {
          position: "top-right",
          autoClose: 1500,
        });
      })
      .catch(err => {
        console.error("Failed to copy file link:", err);
        toast.error("Copy failed.");
      });
  };
  

  const downloadFile = () => {
    const fileName = `${file._id}${file.extension}`;
    const downloadUrl = `${apiUrl}/api/files/download/${fileName}`;
  
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };
  

  const deleteFile = async () => {
    const fileId = file?._id;
  
    if (!fileId) {
      toast.error("Invalid file ID");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;
  
    const deleteUrl = `${apiUrl}/api/files/${fileId}`;
  
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      const text = await response.text();
  
      if (!response.ok) {
        throw new Error(text || "Unknown server error");
      }
  
      toast.success("File deleted", { autoClose: 1500 });
      handleClose();
  
      if (typeof fetchServerFiles === "function") {
        fetchServerFiles(); // 🔁 Refresh the list
      }
    } catch (err) {
      toast.error("Failed to delete file");
    }
  };
  
  
  

  return (
    <React.Fragment>
      <div className='file' onClick={handleClickOpen} style={{ cursor: 'pointer' }}>
      {showFileName && <span className="file-name">{file.name}</span>}
      {file.type === 'image' || file.type === 'video' ? (
      <img className="img-thumbnail" src={mediumThumbnailPath} alt={file.name} />
    ) : (
      <div className="file-placeholder-thumb">
        <span>{file.extension?.replace('.', '').toUpperCase() || 'FILE'}</span>
      </div>
    )}

        <div className="tag-container">
        {showTags && (
          <div className="tag-container">
            {file.tagList.map((tag, index) => (
              <div key={index} className="tag-bubble">
                #{tag}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        PaperProps={{
          sx: {
            minWidth: '50vw',
            bgcolor: 'rgb(58, 58, 58)',     
            color: 'rgb(230, 230, 230)',  
            borderRadius: '12px',           
            overflow: 'hidden'        
          }
        }}
      >
        <div id='draggable-container'>
          <DialogTitle 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }} 
            id="draggable-dialog-title"
          >
            {file.name}
            <IconButton onClick={handleClose} sx={{ color: '#ccc' }}>
              <CancelIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ maxHeight: '60vh', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
            {file.type === 'image' ? (
              file.extension === '.gif' ? (
                <video 
                  className='display-img' 
                  src={filePath} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                />
              ) : (
                <img 
                  className='display-img' 
                  src={filePath} 
                  alt={file.name} 
                  style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                />
              )
            ) : file.type === 'video' ? (
              <video 
                className='display-img' 
                src={filePath} 
                controls 
                playsInline 
                style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
              />
            ) : (
              <div className="file-placeholder-preview">
                <span>{file.extension?.replace('.', '').toUpperCase() || 'FILE'}</span>
              </div>
            )}

            
          </DialogContent>

             <div className="tag-container-large">
           {file.tagList.map((tag, index) => (
             <div key={index} className="tag-bubble-large">
               #{tag}
             </div>
           ))}
           </div>

          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={copyURL} id="draggable-button">Copy URL</Button>
            <Button onClick={downloadFile} id="draggable-button">Download</Button>
            <Button onClick={deleteFile} id="draggable-button">Delete</Button>
          </DialogActions>
        </div>
      </Dialog>
    </React.Fragment>
  );
}


export default DraggableDialog;
