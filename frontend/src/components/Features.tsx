// Displays a set of featured products on the homepage.
// Fetches products from the backend, randomizes them, and displays a selection with navigation to product details.
// Handles loading and error states for a smooth user experience.

import React , { useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Product} from '../types/product';

const Features: React.FC = () => {
  // State for products, loading, and error
  const [products, setProducts] = useState<Product[]>([]); // List of featured products
  const [loading, setLoading] = useState(true); // Loading state for fetch
  const [error, setError] = useState<string | null>(null); // Error state for fetch
  const navigate = useNavigate(); // React Router navigation hook

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      let headers = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers = { Authorization: `Bearer ${token}` }; // Add auth header if logged in
      }
      try {
        // Fetch all products from backend
        const response = await axios.get('http://localhost:3000/products', {
          headers,
        });
        // Randomize and select 5 products for the featured section
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0,5);
        setProducts(selectedProducts); // Set featured products
        setLoading(false); // Done loading
      } catch(err:any) {
        // Handle fetch error
        console.error('Failed to fetch products:', err.response?.data || err.message);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts(); // Call fetch on mount
  }, [navigate]);

  if (loading) {
    return <div className="py-20 bg-primaryBG text-center text-luxury-white">Loading products...</div>;
  }

  if (error) {
    return <div className="py-20 bg-primaryBG text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-20 bg-primaryBG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-luxury-primaryGold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card bg-luxury-black rounded-3xl shadow-md p-4 flex flex-col cursor-pointer group"
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  navigate(`/product/${product._id}`);
                } else {
                  navigate('/login');
                }
              }}
            >
              {/* Product image */}
              <div className="relative group w-full">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:3000${product.imageUrl}`}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-xl mb-5"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
              {/* Product details */}
              <h3 className="text-lg text-luxury-white font-semibold mb-1">{product.name}</h3>
              <p className="text-luxury-offwhite mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                {product.rating && (
                  <span className="ml-2 text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-5 gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl p-1 text-luxury-primaryGold font-bold text-green-700">${product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;