import React from 'react';
import { removeToken } from '../utils/auth';
import '../styles/Auth.css';

const Dashboard = ({ onLogout }) => {
    const handleLogout = () => {
        removeToken();
        onLogout();
    };

    return (
        <div className="auth-container">
            <h2>Dashboard</h2>
            <p>Hoş geldiniz!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
