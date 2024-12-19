import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ArizaPage from './pages/ArizaPage';
import LogoutButton from './components/LogoutButton'; // Logout butonu için ayrı component
import { getToken, removeToken } from './utils/auth';
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
                    removeToken();
                }
            } catch (err) {
                console.error('Invalid token', err);
                setIsAuthenticated(false);
                removeToken();
            }
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <div className="app-container">
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <LogoutButton onLogout={handleLogout} />
                    <ArizaPage />
                </>
            )}
        </div>
    );
};

export default App;
