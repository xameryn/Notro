import React, { useState } from 'react';
import './LeftSidebar.css';
import { useNavigate } from 'react-router-dom';
import { useServer } from '../../contexts/ServerContext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const LeftSidebar = () => {
  const randomServerNames = ["My Uploads", "Server 1", "Server 2", "Server 3", "Server 4"];

  const { selectedServer, setSelectedServer } = useServer();

  const navigate = useNavigate();

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
            <a>My Account</a>
            <button className="temp-red-background" onClick={() => navigate('/connect')}>LOG OUT</button>
        </div>
    </div>
  );
};

export default LeftSidebar;
