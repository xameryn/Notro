import React, { useState } from 'react'
import './Files.css'
import DraggableDialog from '../DraggableDialog/DraggableDialog'

const Files = () => {

    const randomFileNames = ["Dog", "Carrot", "Cat", "Meme", "Funny", "Baseball", "Something", "Another file", "Rabbit", "Computer", "Tooth", "Interesting", "Word", "Whatever"]


    const [isOpen, setIsOpen] = useState(false);
    const [fileToView, setFileToView] = useState('');
  
    const openFile = (file) => {
      setFileToView(file);
      setIsOpen(true);
    };
  
    const closeFile = () => {
      setIsOpen(false);
    };
    
    return (
        <div>
            <h1>Shared Files</h1>

            <div className='files-container'>

              {randomFileNames.map((fileName) => (

                <div key={fileName} className='file' onClick={() => openFile(`${fileName}`)}>
                  {fileName}
                </div>
              ))}
            </div>

            {isOpen && <DraggableDialog open={isOpen} onClose={closeFile} file={fileToView} />}

        </div>
  )
}

export default Files

