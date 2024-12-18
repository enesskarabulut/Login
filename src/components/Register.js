/*
import React, { useState } from 'react';
import axios from 'axios';
import InputField from './InputField';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('/api/register', formData);
            setMessage(response.data.message);
            setFormData({ username: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p className="success">{message}</p>}
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
*/