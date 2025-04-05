import React, { useEffect } from 'react';
 import './Files.css';
 import DraggableDialog from '../DraggableDialog/DraggableDialog';
 import { useServer } from '../../contexts/ServerContext';
 
 const Files = () => {
     const { selectedServer, serverFiles, fetchServerFiles, serverError } = useServer();
 
     useEffect(() => {
        if (selectedServer) {
          fetchServerFiles();
        }
      }, [selectedServer, fetchServerFiles]);

     if (!selectedServer) return <p>Please select a server.</p>;
     if (serverError) return <p>{serverError}</p>;
     if (!serverFiles) return <p>Loading files...</p>;

    
     return (
         <div className='files-section'>
             <p># {selectedServer} files</p>
             <div className='files-container'>
                 {serverFiles.map(file => ( 
                     <DraggableDialog key={file} file={file} />
                 ))}
             </div>
         </div>
     );
 }
 
 export default Files;