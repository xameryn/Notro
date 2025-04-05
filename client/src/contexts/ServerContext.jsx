import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ServerContext = createContext(null);

export const useServer = () => useContext(ServerContext);

export const ServerProvider = ({ userID, children }) => {
    const [selectedServer, setSelectedServer] = useState(null);
    const [serverFiles, setServerFiles] = useState(null)
    const [serverError, setServerError] = useState(null);

    const fetchServerFiles = useCallback(async () => {
      
      if (!selectedServer?.serverID) {
        console.log("No ID found for selected server.")
        return;
      }
  
      try {
        const res = await axios.get(`/files/server/${selectedServer.serverID}`);
        setServerFiles(res.data.files);
        setServerError(null);
      } catch (error) {
        console.error("Error fetching server files:", error);
        setServerFiles(null);
        setServerError("Failed to fetch files for this server");
      }
    }, [selectedServer]);
  
    React.useEffect(() => {
      fetchServerFiles();
    }, [fetchServerFiles]);
  
    return (
        <ServerContext.Provider value={{ selectedServer, setSelectedServer, serverFiles, setServerFiles, serverError, fetchServerFiles}}>
            {children}
        </ServerContext.Provider>
    );
};
