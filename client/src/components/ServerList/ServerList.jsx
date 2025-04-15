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
        <div className="server-icon-container">
              <img
                src="/notroicon.png"
                alt="My Notro Icon"
                className="server-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
        <p>My Notro</p>
      </a>
      
      {serversArray.map(server => (
        <a key={server.id} 
          onClick={() => setSelectedServer(server)} 
          className={selectedServer?.id === server.id ? 'selected-server' : 'unselected-server'}>
          {server.icon ? (
            <div className="server-icon-container">
              <img
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
          {/* <button 
            className="refresh-button" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedServer(server);
            }}
          >
            🔄
          </button> */}
        </a>
      ))}
    </div>
  );
};

export default ServerList;