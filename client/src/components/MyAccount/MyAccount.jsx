import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './MyAccount.css';

function MyAccount({ user, handleLogout }) {
  return (
    <div className='my-account-content'>
      <div className="user-info">
        {user?.avatar ? (
          <img 
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
            alt="Profile"
            className="user-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          />
        ) : (
          <AccountCircleIcon className="user-avatar-fallback" />
        )}
        <p className="username">{user?.username || 'My Account'}</p>
      </div>

      <div className="account-actions">
        <button onClick={handleLogout} className="logout-button">
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}

export default MyAccount;