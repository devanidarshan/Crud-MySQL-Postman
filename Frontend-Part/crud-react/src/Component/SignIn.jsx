import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:7777/api/login-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle success
                Cookies.set("cookieData", JSON.stringify(data.data.cookieData), { expires: 5 });
                Cookies.set("token", data.data.token, { expires: 5 });

                // Check if cookieData is an empty object
                const cookieData = JSON.parse(Cookies.get("cookieData") || '{}');
                if (Object.keys(cookieData).length === 0) {
                    alert('Cookie data is empty. Please register.');
                    navigate('/api/register-user');
                } else {
                    navigate('/api/add-product');
                }
            } else {
                // User not found 
                if (data.message === 'User not found') {
                    alert('User not found. Please register.');
                    navigate('/api/register-user');
                } else {
                    throw new Error(data.message || 'Login failed. Please try again.');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="h-[850px] flex flex-col items-center justify-center bg-gray-100 p-5">
            <h1 className="text-3xl font-bold text-gray-800 mb-5 underline underline-offset-4">Log In</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <label htmlFor="email" className="block text-gray-600 mb-1">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg transition focus:border-green-500 focus:outline-none"
                />

                <label htmlFor="password" className="block text-gray-600 mb-1">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg transition focus:border-green-500 focus:outline-none"
                />

                <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Log In</button>
                <a href="/api/register-user" className="block text-center mt-3 text-green-500 hover:underline">Register User</a>
            </form>
        </div>
    );
}
