import React, { } from 'react';
import './LeftSidebar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useServer } from '../../contexts/ServerContext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const LeftSidebar = () => {
  const randomServerNames = ["My Uploads", "Server 1", "Server 2", "Server 3", "Server 4"];
  const { user, setUser } = useAuth();
  const { selectedServer, setSelectedServer } = useServer();
  const navigate = useNavigate();

  console.log('user:', user);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      navigate('/connect');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='container'>
        <a className='current-server'>
          <p>          {selectedServer}</p>
          <KeyboardArrowDownIcon />
          </a>
        <hr />
        <div className='servers-div'>
          {randomServerNames.map(serverName => (
            <a key={serverName} onClick={() => setSelectedServer(serverName)} className={selectedServer === serverName ? 'selected-server' : 'unselected-server'}>
              <SentimentSatisfiedAltIcon style={{ fontSize: 40 }} />
              <p>{serverName}</p>
            </a>
          ))}
        </div>

        <div className='my-account'>
            <a>
              {user?.profile?.avatar ? (<img src={`https://cdn.discordapp.com/avatars/${user.profile.id}/${user.profile.avatar}.png`} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%' }}/>) : (<AccountCircleIcon style={{ fontSize: 40 }} />)}
              <p>{user?.profile?.global_name || 'My Account'}</p>
            </a>
            <button className="temp-red-background" onClick={handleLogout}>LOG OUT</button>
        </div>
    </div>
  );
};

export default LeftSidebar;
