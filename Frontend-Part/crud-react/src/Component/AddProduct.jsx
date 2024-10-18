import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

export default function AddProduct() {
    const [productName, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [cookieData, setCookieData] = useState(null);
    const [addedProduct, setAddedProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cookie = Cookies.get("cookieData");
        if (cookie) {
            const userData = JSON.parse(cookie);
            setCookieData(userData);
            // Redirect if the user is not an admin
            if (userData.role !== 'Admin') {
                alert("You don't have permission to add products.");
                navigate('/api/get-all-product');
            }
        } else {
            alert("You Need To Login First...☠ ☠ ☠");
            navigate('/api/login-user');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (price <= 0 || quantity <= 0) {
            setError('Price and Quantity must be greater than zero.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:7777/api/add-product', {
                name: productName,
                description,
                price,
                quantity,
            }, { withCredentials: true });

            if (response.data.success) {
                setName('');
                setDescription('');
                setPrice('');
                setQuantity('');
                setAddedProduct(response.data.product);
                navigate('/api/get-all-product');
            } else {
                setError(response.data.message || 'Failed to add product. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to add product. Please try again...');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 underline underline-offset-4">Add Product</h1>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                {cookieData && (
                    <>
                        <p className="text-center text-lg mb-4">
                            Your Role is: <strong className="text-blue-600 underline">{cookieData.role}</strong>
                        </p>
                        <p className="text-center text-lg mb-4">
                            Your Email is: <strong className="text-blue-600 underline">{cookieData.email}</strong>
                        </p>
                    </>
                )}

                {/* Only render the form if the user is an Admin */}
                {cookieData && cookieData.role === 'Admin' && (
                    <form onSubmit={handleSubmit} className="mt-4">
                        <label htmlFor="name" className="block text-gray-600 mb-1">Product Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={productName}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <label htmlFor="description" className="block text-gray-600 mb-1">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        ></textarea>

                        <label htmlFor="price" className="block text-gray-600 mb-1">Price:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            step="0.01"
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <label htmlFor="quantity" className="block text-gray-600 mb-1">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <button
                            type="submit"
                            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add Product
                        </button>
                    </form>
                )}

                {addedProduct && (
                    <div className="mt-6 p-4 border border-green-300 rounded">
                        <h2 className="text-lg font-semibold">Added Product:</h2>
                        <p><strong>Name:</strong> {addedProduct.name}</p>
                        <p><strong>Description:</strong> {addedProduct.description}</p>
                        <p><strong>Price:</strong> {addedProduct.price}</p>
                        <p><strong>Quantity:</strong> {addedProduct.quantity}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
