import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function GetAllProduct({ role, email }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7777/api/get-all-product');
        setData(response.data.data || []);
        setFilteredData(response.data.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(product =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleQuantityChange = (productId, increment) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: Math.max((prevCart[productId] || 0) + increment, 0),
    }));
  };

  // ADD TO CART
  const addToCart = async (product) => {
    const quantity = cart[product.id] || 0;
    if (quantity > 0) {
      console.log(`Added ${quantity} of ${product.name} to cart.`);

      try {
        const userId = localStorage.getItem('userId');
        await axios.post('http://localhost:7777/api/add-to-cart', {
          userId,
          productId: product.id,
          quantity,
        });
        setCart(prevCart => ({ ...prevCart, [product.id]: 0 }));
      } catch (err) {
        console.error('Error adding to cart in database:', err);
        alert('Failed to add item to cart.');
      }
    } else {
      alert('Please select a quantity to add to cart.');
    }
  };

  // REMOVE CART
  const removeCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');

      console.log('Removing item:', { userId, productId });

      const response = await axios.post('http://localhost:7777/api/remove-cart', {
        userId,
        productId,
      });

      console.log(response.data);

      if (response.data.message === 'Item removed from cart successfully.') {
        setCart(prevCart => {
          const newCart = { ...prevCart };
          delete newCart[productId];
          return newCart;
        });
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error removing from cart in database:', err.response ? err.response.data : err);
      alert('Failed to remove item from cart.');
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-gray-600 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-200 mb-10 underline underline-offset-4">Product List</h1>

      {error && <div className="text-red-500 text-center mb-4">Error: {error.message}</div>}

      {role && (
        <p className="text-center text-lg text-black text-[20px] mb-4">
          Your Role is: <strong className="text-blue-300 underline">{role}</strong>
        </p>
      )}

      {email && (
        <p className="text-center text-lg text-black text-[20px] mb-4">
          Your Email is: <strong className="text-blue-300 underline">{email}</strong>
        </p>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-black text-[25px] font-semibold">Search Product Name :</label>
        <input
          type="text"
          placeholder="Enter product name..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 rounded border border-gray-300 w-[400px] focus:outline-none focus:border-blue-500"
        />
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden h-[605px]">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 border-b border-gray-300 text-left">ID</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left">Name</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left">Description</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left">Price</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left">Quantity</th>
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
                <td className="py-2 px-4 border-b border-gray-300">{product.price}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div className="flex items-center  space-x-2">
                    <button
                      className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600 transition"
                      onClick={() => handleQuantityChange(product.id, -1)}
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
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                      onClick={() => removeCart(product.id)}
                    >
                      Remove Cart
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-[30px] font-semibold text-gray-600 py-4">Product Not Found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
