import React from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';
import { useFileRefs } from '../../contexts/FileRefsContext';

const Files = () => {
    const { selectedServer } = useServer();
    const randomFileNames = ["Dog", "Carrot", "Cat", "Meme", "Funny", "Baseball", "Something", "Another file", "Rabbit", "Computer", "Tooth", "Interesting", "Word", "Whatever"];

    const { fileRefs} = useFileRefs();
    console.log('fileRefs', fileRefs)

    return (
        <div className='files-section'>
            <p># {selectedServer} files</p>
            <div className='files-container'>
                {randomFileNames.map(fileName => (
                    <DraggableDialog key={fileName} file={fileName} />
                ))}
                   {fileRefs.map(fileName => (
                    <DraggableDialog key={fileName} file={fileName} />
                ))}
            </div>
        </div>
    );
}

export default Files;