import React from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';
import { useFileRefs } from '../../contexts/FileRefsContext';

const Files = () => {
    const { selectedServer } = useServer();

    const { fileRefs} = useFileRefs();

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
                {parsedFileRefs.map(file => (
                    <DraggableDialog key={file} file={file} />
                ))}
            </div>
        </div>
    );
}

export default Files;