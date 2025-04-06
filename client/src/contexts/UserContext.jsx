import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const UserContext = createContext(null);
const apiUrl = import.meta.env.SERVER_URL || "http://localhost:4000";

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // pull user from localStorage if available
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
    }
  });
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgress = useRef(false);
  
  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userID', user.id);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userID');
    }
  }, [user]);
  
  // Prevent recreation on each render
  const fetchUserFiles = useCallback(async (force = false) => {
    if (!user?.id || (fetchInProgress.current && !force)) return;
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      setError(null);
      
      console.log(`Fetching files for user ${user.id}`);
      const res = await fetch(`${apiUrl}/api/files/user/${user.id}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch files: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Fetched user files:", data);
      setUserFiles(data || []);
    } catch (err) {
      console.error("Failed to fetch files for user:", err);
      setError("Failed to fetch files for this user");
    } finally {
      setLoading(false);
      // Reset fetch in progress flag
      fetchInProgress.current = false;
    }
  }, [user]);
  
  // Effect to fetch user files whenever user changes
  useEffect(() => {
    if (user?.id && !fetchInProgress.current) {
      fetchUserFiles();
    }
  }, [user, fetchUserFiles]);
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        userFiles, 
        setUserFiles, 
        loading, 
        error,
        fetchUserFiles
      }}
    >
      {children}
    </UserContext.Provider>
  );
};