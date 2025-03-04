import React from 'react'
import './LeftSidebar.css'
import { useNavigate } from 'react-router-dom'

const LeftSidebar = () => {

  const navigate = useNavigate()
  return (
    <div className='container'>
        <h1>Your Servers</h1>

        <div className='servers-div'>
            <a>My Uploads</a>
            <a>Server 1</a>
            <a>Server 2</a>
            <a>Server 3</a>
            <a>Server 4</a>
        </div>


        <div className='my-account'>
            <a>My Account</a>
            <button className="temp-red-background" onClick={() => navigate('/connect')}>LOG OUT</button>
        </div>
    </div>
  )
}

export default LeftSidebar