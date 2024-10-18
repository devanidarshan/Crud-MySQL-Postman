import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function GetAllProduct() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [cart, setCart] = useState({});
    const [cookieData, setCookieData] = useState('');
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7777/api/get-all-product', {
                    withCredentials: true,
                });
                setData(response.data.data || []);
                setFilteredData(response.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // SEARCHING
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = data.filter(product =>
            product.name.toLowerCase().includes(value) ||
            product.description.toLowerCase().includes(value) ||
            product.price.toString().includes(value) // Convert price to string for comparison
        );

        setFilteredData(filtered);
    };

    const handleQuantityChange = (productId, increment) => {
        setCart(prevCart => {
            const currentQuantity = prevCart[productId] || 0;
            const newQuantity = Math.max(currentQuantity + increment, 0); // Prevent negative quantities
            return { ...prevCart, [productId]: newQuantity };
        });
    };

    const addToCart = async (product) => {
        const quantity = cart[product.id] || 0;

        if (quantity > 0) {
            try {
                // Call the backend API to add/update the cart
                await axios.post('http://localhost:7777/api/add-to-cart', {
                    productId: product.id,
                    quantity,
                }, { withCredentials: true });

                alert(`Successfully added ${quantity} of ${product.name} to the cart.`);
                // Reset quantity in the local cart state
                setCart(prevCart => ({ ...prevCart, [product.id]: 0 }));
                navigate('/api/get-all-cart');
            } catch (err) {
                console.error('Error adding to cart:', err);
                alert('Failed to add item to cart.');
            }
        } else {
            alert('Select Quantity Please...');
        }
    };

    // Calculate total price
    const calculateTotalPrice = (product) => {
        const quantity = cart[product.id] || 0;
        return (product.price * quantity).toFixed(2);
    };

    return (
        <div className="min-h-screen mx-auto p-4 bg-gray-600 shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-200 mb-10 underline underline-offset-4">Product List</h1>

            {loading && <div className="text-center">Loading products...</div>}
            {error && <div className="text-red-500 text-center mb-4">Error: {error.message}</div>}

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
                    className="p-2 rounded border border-gray-300 w-full max-w-xs focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">ID</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Description</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Price</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Available Quantity</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Selected Quantity</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Total Price</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map(product => (
                                <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="py-2 px-4 border-b border-gray-300">{product.id}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">{product.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">{product.description}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">${product.price}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <span>{product.quantity}</span> {/* Available quantity */}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600 transition"
                                                onClick={() => handleQuantityChange(product.id, -1)}
                                                disabled={cart[product.id] <= 0} // Disable button if quantity is zero
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={cart[product.id] || 0}
                                                readOnly
                                                className="text-center border border-gray-300 w-16"
                                            />
                                            <button
                                                className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600 transition"
                                                onClick={() => handleQuantityChange(product.id, 1)}
                                                disabled={cart[product.id] >= product.quantity} // Limit to available quantity
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <span>${calculateTotalPrice(product)}</span> {/* Display total price */}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <button
                                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center text-[20px] font-semibold text-gray-600 py-4">
                                    Product Not Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
