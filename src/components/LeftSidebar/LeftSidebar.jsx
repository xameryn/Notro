import React, { useState } from 'react';
import './LeftSidebar.css';
import { useNavigate } from 'react-router-dom';
import { useServer } from '../../contexts/ServerContext';

const LeftSidebar = () => {
  const randomServerNames = ["My Uploads", "Server 1", "Server 2", "Server 3", "Server 4"];

  const { selectedServer, setSelectedServer } = useServer();

  const navigate = useNavigate();

  return (
    <div className='container'>
        <h1>Your Servers</h1>
        <div className='servers-div'>
          {randomServerNames.map(serverName => (
            <a key={serverName} onClick={() => setSelectedServer(serverName)} className={selectedServer === serverName ? 'selected-server' : 'unselected-server'}>
              {serverName}
            </a>
          ))}
        </div>

        <div className='my-account'>
            <a>My Account</a>
            <button className="temp-red-background" onClick={() => navigate('/connect')}>LOG OUT</button>
        </div>
    </div>
  );
};

export default LeftSidebar;
