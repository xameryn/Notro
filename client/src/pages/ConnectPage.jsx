import React, { useEffect } from 'react';
import './styles/ConnectPage.css';

const ConnectPage = () => {
  const origin = window.location.origin;

  const handleDiscordRedirect = async () => {
    try {
      const res = await fetch(`http://localhost:4001/auth/discord/url?origin=${encodeURIComponent(origin)}`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Failed to fetch Discord URL:", err);
    }
  };

  return (
    <div className='connect-div'>
      <img src="/notroicon.png" alt="Discord connect icon" />
      <h1>Notro</h1>
      <h5>No Nitro, No Problem</h5>

      <div className='buttons'>
        <button className='discord-button' onClick={handleDiscordRedirect}>
          <p>Connect using Discord</p>
          <img src="/discord_icon.png" alt="Discord Icon" />
        </button>
      </div>
    </div>
  );
};

export default ConnectPage;
