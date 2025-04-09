import React, { useState, useEffect } from 'react';
import './LeftSidebar.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useServer } from '../../contexts/ServerContext';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MyAccount from '../MyAccount/MyAccount';
import ServerList from '../ServerList/ServerList';

const LeftSidebar = () => {
  const { user, setUser } = useUser();
  const { selectedServer, setSelectedServer, getUserServers } = useServer();
  const navigate = useNavigate();
  const apiServerUrl = import.meta.env.FILE_SERVER_URL || 'http://localhost:4000';
  const authServerUrl = import.meta.env.AUTH_SERVER_URL || 'http://localhost:4001';
  const [connectionError, setConnectionError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverChecked, setServerChecked] = useState(false);

  useEffect(() => {
    if (getUserServers !== null) {
      setLoading(false);
    }
  }, [getUserServers]);

  useEffect(() => {
    if (!serverChecked) {
      const checkConnection = async () => {
        try {
          setLoading(true);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          if (!user) {
            handleLogout();
            return;
          }
          
          const response = await fetch(`${apiServerUrl}/api/files/user/${user.id}`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            credentials: 'include'
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            setConnectionError(false);
            console.log("API server connection successful");
          } else {
            setConnectionError(true);
            console.error("API server returned error:", response.status);
          }
        } catch (error) {
          console.error('API server connection check failed:', error);
          setConnectionError(true);
        } finally {
          setLoading(false);
          setServerChecked(true);
        }
      };

      if (user) {
        checkConnection();
      }
    }
  }, [user, serverChecked]);

  const discordServers = getUserServers();

  const handleLogout = async () => {
    try {
      await fetch(`${authServerUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setServerChecked(false); // Reset check on logout
      navigate('/connect');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='left-sidebar-container'>
      {connectionError && (
        <div className="connection-error">
          <ErrorOutlineIcon style={{ color: 'red' }} />
          <p>Connection to API server failed</p>
        </div>
      )}
      
      <div className="servers-list-wrapper">
        {loading ? (
          <div className="loading-servers">Loading servers...</div>
        ) : (
          <ServerList 
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            displayedServers={discordServers}
          />
        )}
      </div>

      <div className="my-account">
        <MyAccount user={user} handleLogout={handleLogout} />
      </div>
    </div>
  );
};

export default LeftSidebar;