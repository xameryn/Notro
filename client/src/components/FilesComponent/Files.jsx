import React, { useEffect, useRef } from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';

const Files = () => {
    const { selectedServer, serverFiles, fetchServerFiles, serverError, loading } = useServer();
    const fetchRequestedRef = useRef(false);
    
    useEffect(() => {
        if (selectedServer) {
            console.log(`Server selection changed to: ${typeof selectedServer === 'object' ? selectedServer.name : selectedServer}`);
            fetchRequestedRef.current = false;
        }
    }, [selectedServer]);

    useEffect(() => {
        if (selectedServer && !fetchRequestedRef.current && !loading) {
            console.log(`Requesting files for server: ${typeof selectedServer === 'object' ? selectedServer.name : selectedServer}`);
            fetchRequestedRef.current = true;
            fetchServerFiles();
        }
    }, [selectedServer, fetchServerFiles, loading]);

    if (!selectedServer) return <p>Please select a server.</p>;
    if (serverError) return <p className="error-message">{serverError}</p>;
    if (loading) return <p className="loading-message">Loading files...</p>;
    
    return (
        <div className='files-section'>
            <p className="server-name-display"># {typeof selectedServer === 'object' ? selectedServer.name : selectedServer} files</p>
            <div className='files-container'>
                {!serverFiles || serverFiles.length === 0 ? (
                    <div className="no-files-message">
                        <p>No files found in this server.</p>
                    </div>
                ) : (
                    serverFiles.map(file => (
                        <DraggableDialog key={file._id || file.id || Math.random()} file={file} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Files;