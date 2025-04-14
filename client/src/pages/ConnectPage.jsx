import React from 'react'
// import { useNavigate } from 'react-router-dom'
import './styles/ConnectPage.css'

const ConnectPage = () => {
  // const navigate = useNavigate()
  const authServerUrl = import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:4001';

  const handleDiscordLogin = () => {
    const origin = window.location.origin;
    window.location.href = `${authServerUrl}/auth/discord?origin=${encodeURIComponent(origin)}`;
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
          {/* <button className="discord-skip-button" onClick={() => navigate('/')}>[ DEV - SKIP LOGIN ]</button> */}
        </div>
    </div>
  )
}

export default ConnectPage