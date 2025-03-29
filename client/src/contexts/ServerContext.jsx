import React, { createContext, useContext, useEffect, useState } from 'react';

const ServerContext = createContext(null);

export const useServer = () => useContext(ServerContext);

export const ServerProvider = ({ userID, children }) => {
    const [selectedServer, setSelectedServer] = useState(null);
    const [serverFiles, setServerFiles] = useState(null)
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        const fetchServerFiles = async () => {
          if (!selectedServer?._id) return;
    
          try {
            const res = await axios.get(`/files/server/${selectedServer._id}`);
            setServerFiles(res.data);
            setServerError(null);
          } catch (error) {
            console.error("Error fetching server files:", error);
            setServerFiles(null);
            setServerError("Failed to fetch files for this server");
          }
        };
    
        fetchServerFiles();
      }, [selectedServer]);
  
   

    return (
        <ServerContext.Provider value={{ selectedServer, setSelectedServer, serverFiles, setServerFiles, serverError,}}>
            {children}
        </ServerContext.Provider>
    );
};
