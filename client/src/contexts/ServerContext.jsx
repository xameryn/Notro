import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';

const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

const ServerContext = createContext(null);

export const useServer = () => useContext(ServerContext);

export const ServerProvider = ({ children }) => {
  const { user } = useUser();
  const [selectedServer, setSelectedServer] = useState("My Uploads");
  const [serverFiles, setServerFiles] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userServers, setUserServers] = useState([]);
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef({});
  const fetchTimeoutRef = useRef(null);

  // Fetch servers from db
  const fetchUserServers = useCallback(async () => {
    if (!user) return [];
    
    try {
      const response = await fetch(`${apiUrl}/api/servers`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch registered servers');
      }

      const registeredServers = await response.json();
      
      // Filter user's guilds to only include registered servers in db
      if (user.guilds && Array.isArray(user.guilds)) {
        const filteredServers = user.guilds.filter(guild => 
          registeredServers.some(server => server._id === guild.id)
        );
        setUserServers(filteredServers);
        return filteredServers;
      } 
      
      return [];
    } catch (error) {
      console.error('Error fetching registered servers:', error);
      return [];
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserServers();
    } else {
      setUserServers([]);
    }
  }, [user, fetchUserServers]);

  const getUserServers = useCallback(() => {
    return userServers;
  }, [userServers]);

  // Fetch files for server
  const fetchServerFiles = useCallback(async (force = false) => {
    const serverId = typeof selectedServer === 'object' ? selectedServer.id : selectedServer;
    
    if (!selectedServer || (fetchingRef.current && !force)) {
      console.log("Fetch aborted: No server, already fetching, or not forced");
      return;
    }
    
    // Kinda a weird way to handle this, on the backburner for now
    const now = Date.now();
    const lastFetchTime = lastFetchTimeRef.current[serverId] || 0;
    const minTimeBetweenFetches = 2000;
    
    if (now - lastFetchTime < minTimeBetweenFetches && !force) {
      console.log(`Debouncing fetch for server ${serverId} - last fetch was ${now - lastFetchTime}ms ago`);
      
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      fetchTimeoutRef.current = setTimeout(() => {
        fetchServerFiles(true);
      }, minTimeBetweenFetches - (now - lastFetchTime));
      
      return;
    }
    
    // Mark fetch in progress
    fetchingRef.current = true;
    setLoading(true);
    setServerError(null);
    
    try {
      console.log(`Fetching files for server: ${serverId}`);
      
      // If it's "My Uploads", we'll fetch user's personal files
      // TODO: Make this more robust as any server named "My Uploads" will be treated as the personal server
      if (selectedServer === "My Uploads" && user?.id) {
        const res = await fetch(`${apiUrl}/api/files/user/${user.id}`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch files: ${res.statusText}`);
        }
        
        const data = await res.json();
        // Update last fetch time
        lastFetchTimeRef.current[serverId] = Date.now();
        setServerFiles(data || []);
      } 
      else if (selectedServer?.id && selectedServer.id !== 'my-uploads') {
        const res = await fetch(`${apiUrl}/api/files/server/${selectedServer.id}`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch server files: ${res.statusText}`);
        }
        
        const data = await res.json();

        lastFetchTimeRef.current[serverId] = Date.now();
        setServerFiles(data || []);
      }
    } catch (error) {
      console.error("Error fetching server files:", error);
      setServerFiles([]);
      setServerError("Failed to fetch files for this server");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [selectedServer, user]);

  const handleServerSelection = useCallback((server) => {
    console.log("Changing server selection to:", server);
    setSelectedServer(server);

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!fetchingRef.current && user) {
      fetchServerFiles();
    }
  }, [fetchServerFiles, selectedServer, user]);

  return (
    <ServerContext.Provider 
      value={{ 
        selectedServer, 
        setSelectedServer: handleServerSelection, 
        serverFiles, 
        serverError, 
        loading,
        fetchServerFiles,
        getUserServers,
        userServers,
        fetchUserServers
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};