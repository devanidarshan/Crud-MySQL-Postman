import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="max-w-6xl mx-auto flex justify-between items-center p-7">
                <div className="text-red-400 text-[25px] font-bold">
                    <NavLink to="/api/get-all-product" className="hover:text-gray-400 transition">
                        Ecommerce - Site
                    </NavLink>
                </div>
                <div className="flex space-x-16 text-[20px]">
                    <NavLink 
                        to="/api/register-user" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        SignUp
                    </NavLink>
                    <NavLink 
                        to="/api/login-user" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        SignIn
                    </NavLink>
                    <NavLink 
                        to="/api/add-product" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        Add Product
                    </NavLink>
                    <NavLink 
                        to="/api/get-all-product" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink 
                        to="/api/get-all-cart" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        Carts
                    </NavLink>
                    <NavLink 
                        to="/api/signout-user" 
                        className={({ isActive }) => 
                            `text-white hover:text-gray-400 transition ${isActive ? 'font-bold border-b-2 border-white pb-1' : ''}`
                        }
                    >
                        SignOut
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}
