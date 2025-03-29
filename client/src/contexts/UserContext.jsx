import React, { createContext, useContext, useEffect, useState } from 'react';


const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userID, setUserID] = useState(null);   // how to we fetch the userID? 

    const [userFiles, setUserFiles] = useState([]);
    const [userServers, setUserServers] = useState([])

    useEffect(() => {
        const fetchUserFiles = async () => {
          try {
            const response = await axios.get(`/files/user/${userID}`);
            setUserFiles(response.data); 
          } catch (err) {
            setError("Failed to fetch files for this user");
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        if (userID) {
          fetchUserFiles();
        }
      }, [userID]);

      useEffect(() => {
        const fetchServers = async () => {
          try {
            const response = await axios.get(`/servers/user/${userID}`); // This endpoint doesn't exist yet! I guess we'll need to add it? 
            if (response.data.success) {
              setUserServers(response.data.servers);
              setSelectedServer(response.data.servers[0]?.name || null); // Always set initial server to first server?
            }
          } catch (error) {
            console.error("Failed to fetch servers:", error);
          }
        };
    
        if (userID) fetchServers();
      }, [userID]);

    return (
        <UserContext.Provider value={{ userFiles, setUserFiles, userServers, setUserServers }}>
            {children}
        </UserContext.Provider>
    );
};