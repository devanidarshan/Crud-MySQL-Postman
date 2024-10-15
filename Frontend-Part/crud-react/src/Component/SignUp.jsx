import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'None',
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7777/api/register-user', formData);
      console.log('User registered successfully:', response.data);
      navigate('/api/login-user');

    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[820px] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 underline underline-offset-4">Register User</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-1" htmlFor="id">User ID:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            id="id"
            name="id"
            required
            value={formData.id}
            onChange={handleChange}
          />

          <label className="block text-gray-700 mb-1" htmlFor="name">Name:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label className="block text-gray-700 mb-1" htmlFor="email">Email:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label className="block text-gray-700 mb-1" htmlFor="password">New Password:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <label className="block text-gray-700 mb-1" htmlFor="role">Role:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded mb-4"
            type="text"
            id="role"
            name="role"
            value={formData.role}
            required
            onChange={handleChange}
          />

          <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition" type="submit">
            Register User
          </button>
          <a className="block text-center text-green-500 mt-4" href="/api/login-user">Login User</a>
        </form>
      </div>
    </div>
  );
}
