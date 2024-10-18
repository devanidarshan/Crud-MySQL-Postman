import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function GetAllCart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cookieData, setCookieData] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cookie = Cookies.get("cookieData");
        if (cookie) {
            const userData = JSON.parse(cookie);
            setCookieData(userData);
        } else {
            alert("You Need To Login First...☠ ☠ ☠");
            navigate('/api/login-user');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCartItems();
            if (cookieData && cookieData.role === 'Admin') {
                await fetchTotalCart();
            }
        };
        fetchData();
    }, [cookieData]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:7777/api/get-all-cart', {
                withCredentials: true,
            });
            console.log('API response:', response.data);
            setCartItems(response.data.cartItems || []);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError('Failed to load cart items.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalCart = async () => {
        try {
            const response = await axios.get('http://localhost:7777/api/get-all-total-cart', {
                withCredentials: true,
            });
            console.log('API response:', response.data);
            setCartItems(response.data.cartItems || []);
        } catch (err) {
            console.error('Error fetching total cart:', err);
            setError('Failed to load total cart.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const filteredCartItems = cartItems.filter(item =>
        item.productName.toLowerCase().includes(searchTerm)
    );

    const removeCart = async (productId, productName) => {
        console.log(`Product ID: ${productId}, Product Name: ${productName}`);
        try {
            await axios.post('http://localhost:7777/api/remove-cart', {
                productId,
            }, { withCredentials: true });
            alert(`Successfully removed Product ID: ${productId}, Product Name: ${productName} from the cart.`);
            fetchCartItems();
        } catch (err) {
            console.error('Error removing from cart:', err);
            alert(`An error occurred while removing Product ID: ${productId}, Product Name: ${productName} from the cart.`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="h-[860px] mx-auto p-6 bg-gray-600 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-200 mb-10 underline underline-offset-4">All Cart List</h1>

            {cookieData.role && (
                <p className="text-center text-lg text-black text-[20px] mb-4">
                    Your Role is: <strong className="text-blue-300 underline">{cookieData.role}</strong>
                </p>
            )}

            {cookieData.email && (
                <p className="text-center text-lg text-black text-[20px] mb-4">
                    Your Email is: <strong className="text-blue-300 underline">{cookieData.email}</strong>
                </p>
            )}

            <div className="mb-4">
                <label className="block mb-2 text-black text-[25px] font-semibold">Search Product Name:</label>
                <input
                    type="text"
                    placeholder="Enter product name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="p-2 rounded border border-gray-300 w-[400px] focus:outline-none focus:border-blue-500"
                />
            </div>

            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">Product ID</th>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">User ID</th>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">Quantity</th>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">Price</th>
                        <th className="py-3 px-4 border-b border-gray-300 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCartItems.length > 0 ? (
                        filteredCartItems.map((item, index) => (
                            <tr key={`${item.productId}-${item.userId || 'unknown'}-${index}`} className="hover:bg-gray-100 transition duration-200">
                                <td className="py-2 px-4 border-b border-gray-300">{item.productId}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.userId}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.productName}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.quantity}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.price}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    <button
                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                        onClick={() => removeCart(item.productId, item.productName)}
                                    >
                                        Remove Cart
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-[20px] font-semibold text-gray-600 py-4">Cart is Empty.</td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
}
