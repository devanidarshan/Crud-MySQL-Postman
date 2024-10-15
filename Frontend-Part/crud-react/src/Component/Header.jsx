import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="max-w-6xl mx-auto flex justify-between items-center p-7">
                <div className="text-white text-[20px] font-bold">
                    <NavLink to="/api/get-all-product" className="hover:text-gray-400 transition" activeClassName="underline">
                        Ecommerce - Site
                    </NavLink>
                </div>
                <div className="flex space-x-16 text-[20px]">
                    <NavLink to="/api/register-user" className="text-white hover:text-gray-400 transition" activeClassName="underline">
                        SignUp
                    </NavLink>
                    <NavLink to="/api/login-user" className="text-white hover:text-gray-400 transition" activeClassName="underline">
                        SignIn
                    </NavLink>
                    <NavLink to="/api/add-product" className="text-white hover:text-gray-400 transition" activeClassName="underline">
                        Add Product
                    </NavLink>
                    <NavLink to="/api/get-all-product" className="text-white hover:text-gray-400 transition" activeClassName="underline">
                        Products
                    </NavLink>
                    <NavLink to="/api/signout-user" className="text-white hover:text-gray-400 transition" activeClassName="underline">
                        SignOut
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}
