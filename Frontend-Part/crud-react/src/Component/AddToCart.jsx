import React from 'react';

export default function AddToCart ({ role, email, cartItems, products }) {
    const filterProducts = (e) => {
        const searchInput = e.target.value.toLowerCase();
        const productTable = document.getElementById('productTable');
        const rows = productTable.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) { // Skip header row
            const cells = rows[i].getElementsByTagName('td');
            let rowVisible = false;
            
            for (let j = 1; j < cells.length - 1; j++) { 
                if (cells[j].innerText.toLowerCase().includes(searchInput)) {
                    rowVisible = true;
                    break;
                }
            }

            rows[i].style.display = rowVisible ? '' : 'none';
        }
    };

    return (
        <div className="p-5 bg-gray-100">
            <h1 className="text-center text-2xl text-gray-800">Your Cart</h1>

            {role ? (
                <p className="text-center text-lg my-4">
                    Your Role is: <strong className="text-blue-600 underline">{role}</strong>
                </p>
            ) : (
                <p className="text-center text-red-500 italic">Role not provided.</p>
            )}

            {email ? (
                <p className="text-center text-lg my-4">
                    Your Email is: <strong className="text-blue-600 underline">{email}</strong>
                </p>
            ) : (
                <p className="text-center text-red-500 italic">Email not provided.</p>
            )}

            <div className="my-5 text-center">
                <span className="font-bold mr-2">Search as:</span>
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search for products..."
                    onChange={filterProducts}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <table className="w-full border-collapse mt-4 bg-white shadow-md">
                <thead>
                    <tr className="bg-green-500 text-white">
                        <th className="p-3 border">ID</th>
                        <th className="p-3 border">Product Name</th>
                        <th className="p-3 border">Product ID</th>
                        <th className="p-3 border">Quantity</th>
                        <th className="p-3 border">Actions</th>
                    </tr>
                </thead>
                <tbody id="productTable">
                    {Array.isArray(cartItems) && cartItems.length > 0 ? (
                        cartItems.map(cartItem => {
                            const product = products.find(p => p.id === cartItem.productId);
                            return (
                                <tr key={cartItem.id} className="hover:bg-gray-100">
                                    <td className="p-3 border">{cartItem.id}</td>
                                    <td className="p-3 border">{product ? product.name : 'Unknown Product'}</td>
                                    <td className="p-3 border">{cartItem.productId}</td>
                                    <td className="p-3 border">{cartItem.quantity}</td>
                                    <td className="p-3 border">
                                        <form action="/api/remove-cart" method="POST" style={{ display: 'inline' }}>
                                            <input type="hidden" name="id" value={cartItem.id} />
                                            <button type="submit" className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                                                Remove
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center p-3">Item Not Found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

