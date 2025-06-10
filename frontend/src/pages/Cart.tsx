import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import axios from 'axios';
interface CartItem extends Product {
  quantity: number;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

const fetchCart = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await axios.get('http://localhost:3000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('GET /api/cart response:', res.data); // Add this
    setCart(res.data?.items || []);
  } catch (error) {
    console.error('Fetch cart failed:', error.response?.data || error.message); // Add this
  }
};
          
useEffect(() => {
  fetchCart();
}, []);


 const handleRemoveFromCart = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch cart after removal
      await fetchCart();
    } catch (error) {
      console.error('Remove from cart failed:', error.response?.data || error.message);
    }
  }; 
      
    

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-luxury-brown-light/50 to-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-luxury-black">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-lg text-luxury-brown-dark">Your cart is currently empty.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex items-center bg-white rounded shadow p-4 gap-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000${item.imageUrl}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-gray-600">{item.description}</div>
                <div className="text-green-700 font-bold mt-1">${item.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-luxury-black font-medium">Qty: {item.quantity}</span>
                <button
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                  onClick={() => handleRemoveFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
