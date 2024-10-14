import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="max-w-6xl mx-auto flex justify-between items-center p-7">
                <div className="text-white text-[20px] font-bold">
                    <Link to="/api/get-all-product" className="hover:text-gray-400 transition">Ecommerce - Site</Link>
                </div>
                <div className="flex space-x-16 text-[20px]">
                    <Link to="/api/register-user" className="text-white hover:text-gray-400 transition">SignUp</Link>
                    <Link to="/api/login-user" className="text-white hover:text-gray-400 transition">Login</Link>
                    <Link to="/api/add-product" className="text-white hover:text-gray-400 transition">Add Product</Link>
                    <Link to="/api/get-all-product" className="text-white hover:text-gray-400 transition">Products</Link>
                    <Link to="/api/signout-user" className="text-white hover:text-gray-400 transition">SignOut</Link>
                </div>
            </nav>
        </header>
    );
}
