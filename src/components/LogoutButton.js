import React from 'react';
import '../styles/Auth.css';

const LogoutButton = ({ onLogout }) => {
    return (
        <button 
            onClick={onLogout}
            className="logout-button"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
