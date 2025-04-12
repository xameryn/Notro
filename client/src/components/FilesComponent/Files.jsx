import React, { useEffect, useRef, useState } from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';


const Files = () => {
    const { selectedServer, serverFiles, fetchServerFiles, serverError, loading } = useServer();
    const fetchRequestedRef = useRef(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [fileTypeFilter, setFileTypeFilter] = useState('all');


    const filteredFiles = (serverFiles || []).filter(file => {
        const name = file.name?.toLowerCase() || '';
        const tags = (file.tagList || []).map(tag => tag.toLowerCase());
        const type = file.type?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
      
        const matchesQuery = name.includes(query) || tags.some(tag => tag.includes(query));
      
        const matchesType =
          fileTypeFilter === 'all' ||
          (fileTypeFilter === 'other' && !['image', 'video', 'audio', 'text'].some(t => type.startsWith(t))) ||
          type.startsWith(fileTypeFilter);
      
        return matchesQuery && matchesType;
      });

    
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

    const handleContextMenu = (e, file) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            file
        });
    };

    const handleClick = () => {
        if (contextMenu.visible) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu.visible]);

    const copyLink = () => {
              toast.success("File link copied! (Not really)", {
                position: "top-right",
                autoClose: 1500,
              });
        setContextMenu({ ...contextMenu, visible: false });
    };

    const downloadFile = () => {
        toast.success("File downloading! (Not really)", {
          position: "top-right",
          autoClose: 1500,
        });
    setContextMenu({ ...contextMenu, visible: false });
    };



    if (!selectedServer) return <p>Please select a server.</p>;
    if (serverError) return <p className="error-message">{serverError}</p>;
    if (loading) return <p className="loading-message">Loading files...</p>;
    
    return (
        <div className='files-section'>
            <div className='files-header'>
            <p className="server-name-display"># {typeof selectedServer === 'object' ? selectedServer.name : selectedServer} files</p>
            
            <div className="search-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="search-icon" />
                </div>

                <FormControl size="small" className="custom-select-form" sx={{ minWidth: 100 }}>
                <Select
                    labelId="filetype-label"
                    id="filetype-select"
                    value={fileTypeFilter}
                    label="Type"
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                    className="custom-select"
                    MenuProps={{ classes: { paper: 'custom-select-menu' } }}
                    displayEmpty
                    sx={{
                      color: 'rgb(179, 179, 179)',
                      backgroundColor: '#111',
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '.MuiSvgIcon-root': { color: 'rgb(179, 179, 179)' },
                      borderRadius: '6px',
                      paddingRight: '32px', 
                    }}

                            >
                <MenuItem value="all" className="custom-select-item">All</MenuItem>
                <MenuItem value="image" className="custom-select-item">Image</MenuItem>
                <MenuItem value="video" className="custom-select-item">Video</MenuItem>
                <MenuItem value="audio" className="custom-select-item">Audio</MenuItem>
                <MenuItem value="text" className="custom-select-item">Text</MenuItem>
                <MenuItem value="other" className="custom-select-item">Other</MenuItem>
            </Select>
                </FormControl>



                {/* <select
                    className="filetype-dropdown"
                    value={fileTypeFilter}
                    onChange={(e) => setFileTypeFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="text">Text</option>
                    <option value="other">Other</option>
                </select> */}
            </div>

            <div className='files-container'>
                {!serverFiles || serverFiles.length === 0 ? (
                    <div className="no-files-message">
                        <p>No files found in this server.</p>
                    </div>
                ) : (
                    filteredFiles
                    .map(file => (
                        <div
                        key={file._id || file.id || Math.random()}
                        onContextMenu={(e) => handleContextMenu(e, file)}
                        >
                        <DraggableDialog file={file} />
                        </div>                    
                    ))
                )}
            </div>

            {contextMenu.visible && (
                <ul
                    className="custom-context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <li onClick={() => copyLink()}>Copy Link</li>
                    <li onClick={() => downloadFile()}>Download</li>
                </ul>
            )}
        </div>
    );
}

export default Files;