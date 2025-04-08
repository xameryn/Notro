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

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}
function DraggableDialog({ file }) {
  const [open, setOpen] = React.useState(false);

  const filePath = `${apiUrl}/files/${file._id}${file.extension}`
  const smallThumbnailPath = `${apiUrl}${file.thumbnails.small}`
  // const mediumThumbnailPath = `${apiUrl}${file.thumbnails.medium}`
  // const largeThumbnailPath = `${apiUrl}${file.thumbnails.large}`

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const copyURL = () => {
      toast.success("File copied! (Not really)", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
  };

  const downloadFile = () => {
    toast.success("File downloading! (Not really)", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  return (
    <React.Fragment>
      <div className='file' onClick={handleClickOpen} style={{ cursor: 'pointer' }}>
      <span className="file-name">{file.name}</span>
        <img className="img-thumbnail" src={smallThumbnailPath}></img>
        <div className="tag-container">
          {file.tagList.map((tag, index) => (
            <div key={index} className="tag-bubble">
              #{tag}
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
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
        <DialogTitle style={{ cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} id="draggable-dialog-title">
  {file.name}
  <IconButton onClick={handleClose} sx={{ color: '#ccc' }}>
    <CancelIcon />
  </IconButton>
</DialogTitle>
<DialogContent>
            <img className='display-img'
            src={filePath}
              alt={file.name} 
            />
          <Box mt={2}>
            <Typography variant="body1">
            <div className="tag-container-large">
          {file.tagList.map((tag, index) => (
            <div key={index} className="tag-bubble-large">
              #{tag}
            </div>
          ))}
          </div>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>

          <Button onClick={copyURL} id="draggable-button">Copy URL</Button>
          <Button onClick={downloadFile} id="draggable-button">Download</Button>
        </DialogActions>
        </div>
      </Dialog>
    </React.Fragment>
  );
}


export default DraggableDialog;
