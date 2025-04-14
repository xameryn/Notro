import React from 'react';
import './styles/ConnectPage.css';

const authServerUrl = import.meta.env.AUTH_SERVER_URL || 'http://localhost:4001';

const ConnectPage = () => {
  const origin = window.location.origin;
  const clientId = "1348936068635820063";
  const redirectUri = `${authServerUrl}/auth/discord/callback`;
  const scope = "identify guilds";
  const responseType = "code";
  const prompt = "consent";

  const buildOAuthUrl = () => {
    const relativeOauthPath = `/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=${prompt}&state=${encodeURIComponent(origin)}`;
    return `https://discord.com/login?redirect_to=${relativeOauthPath}`;
  };

  const handleDiscordLogin = () => {
    window.location.href = buildOAuthUrl();
  };

  const handleSwitchUser = () => {
    window.location.href = buildOAuthUrl();
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

        <p className="switch-account-note">
          Not your account? <span onClick={handleSwitchUser}>Use a different one</span>
        </p>
      </div>
    </div>
  );
};

export default ConnectPage;
