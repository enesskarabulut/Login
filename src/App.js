import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getToken } from './utils/auth';
import jwtDecode from 'jwt-decode';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Token kontrolü
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

    // Kullanıcı login olduğunda çağrılır
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // Kullanıcı logout olduğunda çağrılır
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            {!isAuthenticated ? (
                // Kullanıcı login olmadığında Login bileşeni gösterilir
                <Login onLogin={handleLogin} />
            ) : (
                // Kullanıcı login olduğunda Dashboard gösterilir
                <Dashboard onLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;
