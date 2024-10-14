import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header'; 
import SignUp from './SignUp';
import SignIn from './SignIn';
import GetAllProduct from './GetAllProduct';
import AddProduct from './AddProduct';
import SignOut from './SignOut';

export default function Router() {
    const [userRole, setUserRole] = useState(null);
    const [userEmail, setUserEmail] = useState(null); 
    const [products, setProducts] = useState([]); 

    const handleLoginSuccess = (role, email) => {
        setUserRole(role);
        setUserEmail(email);
    };

    return (
        <div>
            <Header /> 
            <Routes>
                <Route path="/api/register-user" element={<SignUp />} />
                <Route path="/api/login-user" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/api/add-product" element={<AddProduct role={userRole} email={userEmail}/>} />
                <Route path="/api/get-all-product" element={<GetAllProduct role={userRole} email={userEmail} products={products} />} />
                <Route path="/api/signout-user" element={<SignOut />} />
            </Routes>
        </div>
    );
}
