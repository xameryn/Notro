import React from 'react';
 import './Files.css';
 import DraggableDialog from '../DraggableDialog/DraggableDialog';
 import { useServer } from '../../contexts/ServerContext';
 import { useFileRefs } from '../../contexts/FileRefsContext';
 
 const Files = () => {
     const { selectedServer, serverFiles, serverError } = useServer();
     const { fileRefs} = useFileRefs(); // To be deleted!
 
     if (!selectedServer) return <p>Please select a server.</p>;
     if (serverError) return <p>{serverError}</p>;
     if (!serverFiles) return <p>Loading files...</p>;

     // Following 15 lines to be deleted!
     console.log('fileRefs', fileRefs)
 
     const parsedFileRefs = fileRefs
     .map(fileStr => {
         try {
             return JSON.parse(fileStr); 
         } catch (error) {
             console.error("Can't parse - invalid JSON", fileStr);
             return null; 
         }
     })
     .filter(file => file !== null); 
 
     
     console.log('parsedFileRefs', parsedFileRefs)
 
     return (
         <div className='files-section'>
             <p># {selectedServer} files</p>
             <div className='files-container'>
                 {parsedFileRefs.map(file => ( // To be replaced by serverFiles.map...
                     <DraggableDialog key={file} file={file} />
                 ))}
             </div>
         </div>
     );
 }
 
 export default Files;