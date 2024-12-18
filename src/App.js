// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { getToken } from './utils/auth';
import jwtDecode from 'jwt-decode';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

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
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            {!isAuthenticated ? (
                showRegister ? (
                    <>
                        <Register />
                        <p>
                            Zaten hesabınız var mı?{' '}
                            <button onClick={() => setShowRegister(false)}>Login</button>
                        </p>
                    </>
                ) : (
                    <>
                        <Login onLogin={handleLogin} />
                        <p>
                            Henüz hesabınız yok mu?{' '}
                            <button onClick={() => setShowRegister(true)}>Register</button>
                        </p>
                    </>
                )
            ) : (
                <Dashboard onLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;
