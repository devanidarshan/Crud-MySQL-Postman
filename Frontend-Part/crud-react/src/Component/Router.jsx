import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header'; 
import SignUp from './SignUp';
import SignIn from './SignIn';
import AddProduct from './AddProduct';
import GetAllProduct from './GetAllProduct';
import GetAllCart from './GetAllCart';
import SignOut from './SignOut';

export default function Router() {

    return (
        <div>
            <Header /> 
            <Routes>
                <Route path="/api/register-user" element={<SignUp />} />
                <Route path="/api/login-user" element={<SignIn />} />
                <Route path="/api/add-product" element={<AddProduct/>} />
                <Route path="/api/get-all-product" element={<ProtectedRoute><GetAllProduct /> </ProtectedRoute>}/>
                <Route path="/api/get-all-cart" element={<ProtectedRoute><GetAllCart /></ProtectedRoute>} />
                <Route path="/api/signout-user" element={<SignOut />} />
            </Routes>
        </div>
    );
}
