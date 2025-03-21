import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Button } from '@mui/material';
import Draggable from 'react-draggable';
import './DraggableDialog.css'
import { toast } from 'react-toastify';

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

  const fileName = file.displayName || file.filename;

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
        {fileName} 
        <img src={`http://localhost:4000${file.filePath}`}></img>
        <p>{file.tags}</p>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {fileName}
        </DialogTitle>
        <DialogContent>
            <img className='display-img'
            src={`http://localhost:4000${file.filePath}`}
              alt={fileName} 
            />
          <DialogContentText>
            <p>{file.tags}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={copyURL}>Copy URL</Button>
          <Button onClick={downloadFile}>Download</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default DraggableDialog;
