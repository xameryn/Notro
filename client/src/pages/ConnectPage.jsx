import React from 'react';
import './styles/ConnectPage.css';

const ConnectPage = () => {
  const handleDiscordLogin = () => {
    const origin = window.location.origin;
    const clientId = "1348936068635820063";
    const redirectUri = "http://localhost:4001/auth/discord/callback";
    const scope = "identify guilds";
    const responseType = "code";
    const prompt = "consent";
  
    const relativeOauthPath = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=${prompt}&state=${encodeURIComponent(origin)}`;
    const loginWrapper = `https://discord.com/login?redirect_to=${encodeURIComponent(relativeOauthPath)}`;
  
    window.location.href = loginWrapper;
  };
  

  

  return (
    <div className='connect-div'>
      <img src="/notroicon.png" alt="Discord connect icon" />
      <h1>Notro</h1>
      <h5>No Nitro, No Problem</h5>

      <div className='buttons'>
        <button className='discord-button' onClick={handleDiscordLogin}>
          <p>Connect using Discord</p>
          <img src="/discord_icon.png" alt="Discord Icon" />
        </button>
      </div>
    </div>
  );
};

export default ConnectPage;
