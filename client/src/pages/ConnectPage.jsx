import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/ConnectPage.css'

const ConnectPage = () => {

  const navigate = useNavigate()

  const handleDiscordLogin = () => {
    window.location.href = "http://localhost:4000/auth/discord";
  }

  return (
    <div className='connect-div'>
        <img src="/notroicon.png" alt="Discord connect icon" />
        <h1>Notro</h1>
        <h5>No Nitro, No Problem</h5>

        <div className='buttons'>
          <button className='discord-button' onClick={handleDiscordLogin}>
            <p>Connect using Discord</p>
            <img src="/notroicon.png" alt="Discord connect icon" />
          </button>
          <button className="temp-red-background" onClick={() => navigate('/')}>SKIP AND GO STRAIGHT TO HOMEPAGE</button>
        </div>
    </div>
  )
}

export default ConnectPage