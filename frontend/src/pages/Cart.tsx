// Shopping cart page for the e-commerce application.
// Displays products in the user's cart, allows removal of items, and provides a checkout (clear cart) feature.
// Fetches cart data from the backend and manages cart state and actions.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import axios from 'axios';
import Navbar from '../components/Navbar';

// CartItem extends Product with a quantity field
interface CartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  // State for cart items
  const [cart, setCart] = useState<CartItem[]>([]);
  // State for authentication (not strictly needed for rendering, but could be used for UI logic)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Fetch the user's cart from the backend API
  const fetchCart = async () => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) return; // If not authenticated, do nothing
    try {
      const res = await axios.get('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('GET /api/cart response:', res.data); // Debug: log response
      setCart(res.data?.items || []); // Set cart state with items from backend
    } catch (error) {
      console.error('Fetch cart failed:', error.response?.data || error.message); // Debug: log error
    }
  };

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Remove a product from the cart by productId
  const handleRemoveFromCart = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch cart after removal to update UI
      await fetchCart();
    } catch (error) {
      console.error('Remove from cart failed:', error.response?.data || error.message);
    }
  };

  // Calculate the total price of all items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout: clear the cart on the backend and update UI
  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post('http://localhost:3000/api/cart/clear', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]); // Clear cart in UI
    } catch (error) {
      console.error('Checkout (clear cart) failed:', error.response?.data || error.message);
    }
  };
  

return (
  <>
<Navbar />

    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold p-6">
      <h1 className="text-4xl font-bold mb-6 text-luxury-black">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-lg text-luxury-brown-dark">Your cart is currently empty.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex items-center bg-luxury-primaryBG/90 rounded-lg shadow p-4 gap-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000${item.imageUrl}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-luxury-white text-lg">{item.name}</div>
                {/* <div className="text-gray-600">{item.description}</div> */}
                <div className="text-luxury-primaryGold font-bold mt-1">${item.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-luxury-white font-medium">Qty: {item.quantity}</span>
                <button
                  className="ml-2 px-3 py-1 bg-black/20 text-white rounded hover:bg-black transition"
                  onClick={() => handleRemoveFromCart(item._id)}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" stroke-width="1.5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 11v6M13.9 11v6"/>
                </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {cart.length > 0 && (
  <div className="w-full max-w-2xl flex flex-col items-end mt-6">
    <div className="text-2xl font-bold text-luxury-black mb-2">Total: <span className="text-luxury-black">${totalPrice.toLocaleString()}</span></div>
    <button
      className="px-6 py-2 bg-luxury-primaryGold text-luxury-black font-semibold rounded shadow hover:bg-luxury-black hover:text-luxury-white transition"
      onClick={handleCheckout}
    >
      Checkout
    </button>
  </div>
)}
    </div>
    </>
  );
};

export default Cart;
