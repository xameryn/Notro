import React from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';

const Files = () => {
    const { selectedServer } = useServer();
    const randomFileNames = ["Dog", "Carrot", "Cat", "Meme", "Funny", "Baseball", "Something", "Another file", "Rabbit", "Computer", "Tooth", "Interesting", "Word", "Whatever"];

    return (
        <div>
            <h1>Shared Files</h1>
            <h2>{selectedServer}</h2>
            <div className='files-container'>
                {randomFileNames.map(fileName => (
                    <DraggableDialog key={fileName} file={fileName} />
                ))}
            </div>
        </div>
    );
}

export default Files;
