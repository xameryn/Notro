import React from 'react'
import { useNavigate } from 'react-router-dom'

const ConnectPage = () => {

  const navigate = useNavigate()
  
  return (
    <div>
            <h1>Connect to Notro Using Discord</h1>
            <button>CONNECT</button>
            <button className="temp-red-background" onClick={() => navigate('/')}>SKIP AND GO STRAIGHT TO HOMEPAGE</button>
    </div>
  )
}

export default ConnectPage