// src/components/Dashboard.js
import React from 'react';
import { removeToken } from '../utils/auth';

const Dashboard = ({ onLogout }) => {
    const handleLogout = () => {
        removeToken();
        onLogout();
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Hoş geldiniz!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
