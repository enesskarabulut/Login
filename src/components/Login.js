import React, { useState } from 'react';
import axios from 'axios';
import { setToken } from '../utils/auth';
import InputField from './InputField';
import '../styles/Auth.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/login', formData);
            setToken(response.data.token);
            onLogin();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    name="username"
                />
                <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    name="password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
