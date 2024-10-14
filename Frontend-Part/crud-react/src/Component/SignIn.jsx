import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const roles = ['Buyer', 'Seller', 'Admin'];
            const randomRole = roles[Math.floor(Math.random() * roles.length)]; 
    
            const response = { success: true, role: randomRole }; 
    
            if (response.success) {
                const role = response.role; 
                onLoginSuccess(role, email); 
                navigate('/api/add-product'); 
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-5">
            <h1 className="text-2xl text-gray-800 mb-5">Log In</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                {error && <div className="text-red-500 mb-2 text-center">{error}</div>}

                <label htmlFor="email" className="block text-gray-600 mb-1">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mb-3 border border-gray-300 rounded transition focus:border-green-500 focus:outline-none"
                />

                <label htmlFor="password" className="block text-gray-600 mb-1">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 mb-3 border border-gray-300 rounded transition focus:border-green-500 focus:outline-none"
                />

                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Log In</button>
                <a href="/api/register-user" className="block text-center mt-2 text-green-500 hover:underline">Register User</a>
            </form>
        </div>
    );
}
