import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ArizaPage from './pages/ArizaPage'; // ArizaPage import ediliyor
import { getToken } from './utils/auth';
import jwtDecode from 'jwt-decode';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error('Invalid token', err);
                setIsAuthenticated(false);
            }
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <div className="app-container">
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <ArizaPage /> 
            )}
        </div>
    );
};

export default App;
