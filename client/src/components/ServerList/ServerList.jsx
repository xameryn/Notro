import React from 'react';
import './ServerList.css';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const ServerList = ({ 
  selectedServer, 
  setSelectedServer, 
  displayedServers
}) => {
  const serversArray = Array.isArray(displayedServers) ? displayedServers : [];
  
  return (
    <div className='servers-container'>
      <a onClick={() => setSelectedServer("My Uploads")} 
        className={selectedServer === "My Uploads" ? 'selected-server' : 'unselected-server'}>
        <SentimentSatisfiedAltIcon style={{ fontSize: 40 }} />
        <p>My Uploads</p>
      </a>
      
      {serversArray.map(server => (
        <a key={server.id} 
          onClick={() => setSelectedServer(server)} 
          className={selectedServer?.id === server.id ? 'selected-server' : 'unselected-server'}>
          {server.icon ? (
            <div className="server-icon-container">
              <img 
                // src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                src={server.icon} 
                alt={server.name}
                className="server-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <SentimentSatisfiedAltIcon style={{ fontSize: 40 }} />
          )}
          <p className="server-name">{server.name}</p>
        </a>
      ))}
    </div>
  );
};

export default ServerList;