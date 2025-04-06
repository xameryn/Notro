import React, { useEffect, useRef } from 'react'
import LeftSidebar from '../components/LeftSidebar/LeftSidebar'
import Files from '../components/FilesComponent/Files'
import Upload from '../components/Upload/Upload'
import '../App.css'
import '../Index.css'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

function App() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const authServerUrl = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:4001';
  const authCheckInProgress = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Prevent duplicate calls
      if (authCheckInProgress.current) return;
      
      try {
        authCheckInProgress.current = true;
        console.log("Fetching user data from auth server...");
        
        const res = await fetch(`${authServerUrl}/auth/me`, {
          credentials: 'include',
        });
  
        if (!res.ok) {
          console.log("User not logged in, redirecting to login page");
          navigate('/connect');
          return;
        }
  
        const userData = await res.json();
        console.log("Logged-in user:", userData);
        setUser(userData);
      } catch (err) {
        console.log("Error fetching user:", err.message);
        navigate('/connect');
      } finally {
        authCheckInProgress.current = false;
      }
    };
  
    if (!user && !authCheckInProgress.current) {
      fetchUser();
    }
  }, [authServerUrl, setUser, navigate, user]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div id="main">
      <LeftSidebar />
      <Files />
      <Upload />
    </div>
  )
}

export default App