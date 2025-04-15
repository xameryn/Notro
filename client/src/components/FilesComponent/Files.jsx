import React, { useEffect, useRef, useState } from 'react';
import './Files.css';
import DraggableDialog from '../DraggableDialog/DraggableDialog';
import { useServer } from '../../contexts/ServerContext';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { Select, MenuItem, FormControl, InputLabel, Checkbox } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';


const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

const Files = () => {
    const { selectedServer, serverFiles, fetchServerFiles, serverError, loading } = useServer();
    const fetchRequestedRef = useRef(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [fileTypeFilter, setFileTypeFilter] = useState('all');
    const [sortOption, setSortOption] = useState('mostRecent');
    const [viewOptionsVisible, setViewOptionsVisible] = useState(false);
    const [showTags, setShowTags] = useState(true);
    const [showFileName, setShowFileName] = useState(true);
    const filteredFiles = (serverFiles || [])
  .filter(file => {
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
  })
  .sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortOption === 'oldest') {
      return new Date(a.uploadDate) - new Date(b.uploadDate);
    }
    return new Date(b.uploadDate) - new Date(a.uploadDate);
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

    const deleteFile = async () => {
      const fileId = contextMenu.file?._id;
    
      if (!fileId) {
        toast.error("Invalid file ID");
        return;
      }
    
      const confirmDelete = window.confirm("Are you sure you want to delete this file?");
      if (!confirmDelete) return;
    
      const deleteUrl = `${apiUrl}/api/files/${fileId}`;
    
      try {
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          credentials: 'include',
        });
    
        const text = await response.text();
    
        if (!response.ok) {
          throw new Error(text || "Unknown server error");
        }
    
        toast.success("File deleted", { autoClose: 1500 });
        fetchServerFiles(); //refresh UI
      } catch (err) {
        toast.error("Failed to delete file");
      }
    
      setContextMenu({ ...contextMenu, visible: false });
    };
    
    
    
    
    

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu.visible]);

    const copyLink = () => {
      const filePath = `${apiUrl}/files/${contextMenu.file._id}${contextMenu.file.extension}`;
      navigator.clipboard.writeText(filePath).then(() => {
        toast.success("File link copied!", {
          position: "top-right",
          autoClose: 1500,
        });
      }).catch(err => {
        console.error("Failed to copy file link:", err);
      });

      setContextMenu({ ...contextMenu, visible: false });
    };

    const downloadFile = () => {
      const file = contextMenu.file;
      if (!file) return;
    
      const fileName = `${file._id}${file.extension}`;
      const downloadUrl = `${apiUrl}/api/download/${fileName}`;
    
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', file.name); // or use fileName to force extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
      setContextMenu({ ...contextMenu, visible: false });
    };
    
    



    if (!selectedServer) return <p>Please select a server.</p>;
    if (serverError) return <p className="error-message">{serverError}</p>;
    if (loading) return <p className="loading-message">Loading files...</p>;
    
    return (
        <div className='files-section'>
            <div className='files-header'>
            <p className="server-name-display"># {typeof selectedServer === 'object' ? selectedServer.name : selectedServer}</p>
            
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

                <FormControl size="small" className="custom-select-form"     sx={{
    minWidth: 100,
    fontFamily: '"Outfit", sans-serif !important',
    '*': {
      fontFamily: '"Outfit", sans-serif !important',
    },
  }}>
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
                      color: 'rgb(146, 146, 146)',
                      fontFamily: '"Outfit", sans-serif !important',
                      '*': {
                        fontFamily: '"Outfit", sans-serif !important',
                      },
                      fontSize: '0.88em',
                      backgroundColor: '#111',
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '.MuiSvgIcon-root': { color: 'rgb(139, 139, 139)' },
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

                <FormControl size="small" className="custom-select-form"     sx={{
                    minWidth: 100,
                    fontFamily: '"Outfit", sans-serif !important',
                    '*': {
                    fontFamily: '"Outfit", sans-serif !important',
                    },
                }}>
                <Select
                    labelId="filetype-label"
                    id="filetype-select"
                    label="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="custom-select"
                    MenuProps={{ classes: { paper: 'custom-select-menu' } }}
                    displayEmpty
                    sx={{
                      color: 'rgb(146, 146, 146)',
                      fontFamily: '"Outfit", sans-serif !important',
                      '*': {
                        fontFamily: '"Outfit", sans-serif !important',
                      },
                      fontSize: '0.88em',
                      backgroundColor: '#111',
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '.MuiSvgIcon-root': { color: 'rgb(139, 139, 139)' },
                      borderRadius: '6px',
                      paddingRight: '32px', 
                    }}

                            >
<MenuItem value="mostRecent" className="custom-select-item">Most Recent</MenuItem>
<MenuItem value="oldest" className="custom-select-item">Oldest</MenuItem>
<MenuItem value="alphabetical" className="custom-select-item">Alphabetical</MenuItem>

            </Select>
                </FormControl>

                <div className="view-options-wrapper">
  <button className="view-button" onClick={() => setViewOptionsVisible(!viewOptionsVisible)}>
    View
  </button>

  {viewOptionsVisible && (
    <div className="view-options-panel">
     <div className="view-option">
  <span>Show tags:</span>
  <div>
    <label>
      <Checkbox
        checked={showTags}
        onChange={() => setShowTags(true)}
        sx={{
          color: '#666',
          '&.Mui-checked': {
            color: '#7289da',
          },
          padding: '0 4px 0 0'
        }}
        size="small"
      />
      Yes
    </label>
    <label style={{ marginLeft: '12px' }}>
      <Checkbox
        checked={!showTags}
        onChange={() => setShowTags(false)}
        sx={{
          color: '#666',
          '&.Mui-checked': {
            color: '#7289da',
          },
          padding: '0 4px 0 0'
        }}
        size="small"
      />
      No
    </label>
  </div>
</div>

<div className="view-option">
  <span>Show file name:</span>
  <div>
    <label>
      <Checkbox
        checked={showFileName}
        onChange={() => setShowFileName(true)}
        sx={{
          color: '#666',
          '&.Mui-checked': {
            color: '#7289da',
          },
          padding: '0 4px 0 0'
        }}
        size="small"
      />
      Yes
    </label>
    <label style={{ marginLeft: '12px' }}>
      <Checkbox
        checked={!showFileName}
        onChange={() => setShowFileName(false)}
        sx={{
          color: '#666',
          '&.Mui-checked': {
            color: '#7289da',
          },
          padding: '0 4px 0 0'
        }}
        size="small"
      />
      No
    </label>
  </div>
</div>

    </div>
  )}
</div>

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
                        <DraggableDialog
                          file={file}
                          showTags={showTags}
                          showFileName={showFileName}
                          fetchServerFiles={fetchServerFiles}
                        />

                        </div>                    
                    ))
                )}
            </div>

            {contextMenu.visible && (
              <ul className="custom-context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                <li onClick={copyLink}>
                  <ContentCopyIcon fontSize="small" style={{ marginRight: '8px' }} />
                  Copy Link
                </li>
                <li onClick={downloadFile}>
                  <DownloadIcon fontSize="small" style={{ marginRight: '8px' }} />
                  Download
                </li>
                <li onClick={deleteFile} style={{ color: '#d66' }}>
                  <DeleteIcon fontSize="small" style={{ marginRight: '8px' }} />
                  Delete
                </li>
              </ul>
            )}

        </div>
    );
}

export default Files;