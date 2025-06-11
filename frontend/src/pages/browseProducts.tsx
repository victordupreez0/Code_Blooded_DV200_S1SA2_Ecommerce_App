// browseProducts.tsx
// Product browsing page for the e-commerce application.
// Displays all approved products with filtering (category, price, rating) and add-to-cart functionality.
// Integrates with backend API for product data and cart operations, and provides a responsive UI.

import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Top navigation bar
import Hero from '../components/Features'; // (Optional) Hero/feature section
import Footer from '../components/Footer'; // Bottom footer
import { useProducts } from '../hooks/useProducts'; // Custom hook to fetch products
import { Product } from '../types/product'; // Product type definition
import "../components/styling/main.css"; // Main CSS for styling
import axios from 'axios'; // For HTTP requests (add to cart)
import { FaFlag } from 'react-icons/fa'; // Flag icon (not used in this excerpt)

const BrowseProducts: React.FC = () => {
  // Fetch products and loading/error state from custom hook
  const { products, loading, error } = useProducts();
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // State for minimum price filter
  const [minPrice, setMinPrice] = useState('');
  // State for maximum price filter
  const [maxPrice, setMaxPrice] = useState('');
  // State for minimum rating filter
  const [minRating, setMinRating] = useState('');

  // Helper to extract unique categories from products
  const getUniqueCategories = (products: Product[]) => {
    const cat = new Set<string>();
    products.forEach(p => p.category && cat.add(p.category));
    return Array.from(cat);
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
  };

  // Get all unique categories for filter sidebar
  const categories = getUniqueCategories(products);

  // Filter products based on selected filters and approval status
  const filteredProducts = products.filter((product) => {
    let pass = true;
    if (product.status !== 'approved') pass = false; // Only show approved products
    if (selectedCategory !== 'All' && product.category !== selectedCategory) pass = false; // Category filter
    if (minPrice && Number(product.price) < Number(minPrice)) pass = false; // Min price filter
    if (maxPrice && Number(product.price) > Number(maxPrice)) pass = false; // Max price filter
    if (minRating && (!product.rating || product.rating < Number(minRating))) pass = false; // Min rating filter
    return pass;
  });

  // Add a product to the cart (requires authentication)
  const handleAddToCart = async (productId: string, quantity = 1) => {
    console.log('Adding productId:', productId, 'Token present:', !!localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to login and clear local storage
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
    try {
      // Send POST request to backend to add product to cart
      const res = await axios.post('http://localhost:3000/api/cart/add', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Add to cart response:', res.data);
    } catch (error: any) {
      // Handle errors, especially authentication errors
      console.error('Add to cart failed:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        // If unauthorized, clear token and redirect
        console.log('Unauthorized, clearing token and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // Log other error details
        console.error('Add to cart error details:', error.response?.data);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex">
        <aside className="fixed top-[80px] left-5 h-fit-content w-52 border-r border-luxury-primaryGold p-4 z-40 hidden md:block">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-luxury-white tracking-wide uppercase text-l">Category</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full text-left px-2 py-1 transition font-semibold tracking-wide text-md border-transparent ${selectedCategory === 'All' ? 'text-luxury-black bg-luxury-primaryGold' : 'text-luxury-primaryGold hover:bg-luxury-gold-medium hover:text-black'}`}
                    onClick={() => setSelectedCategory('All')}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`w-full text-left px-2 py-1 transition font-semibold tracking-wide text-md border-transparent
                        ${selectedCategory === cat
                          ? 'text-luxury-primaryGold border-l-luxury-primaryGold bg-luxury-gold-medium/10'
                          : 'text-luxury-primaryGold hover:bg-luxury-gold-medium hover:text-black'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-luxury-white tracking-wide uppercase text-l">Price</h3>
              <div className="flex flex-col gap-2 items-center">
                <input
                  type="range"
                  min={1000000}
                  max={5000000000}
                  step={1000000}
                  value={minPrice ? minPrice : 1000000}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full accent-luxury-primaryGold"
                />
                <div className="flex justify-between w-full text-xs text-luxury-white">
                  <span>1M</span>
                  <span>5B</span>
                </div>
                <div className="text-luxury-primaryGold font-semibold mt-1">
                  Min Price: ${Number(minPrice || 1000000).toLocaleString()}
                </div>
              </div>
            </div>
            <button
              className="w-full mt-2 py-2 bg-luxury-brown-light text-black rounded font-semibold hover:bg-luxury-gold-medium transition"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </aside>
        <div className="flex-1 p-6 md:ml-64">
          {loading && <div>Loading products...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredProducts.map((product: Product) => (
                <div
                  key={product._id}
                  className="product-card bg-luxury-black rounded-3xl shadow-md p-4 flex flex-col cursor-pointer group"
                  onClick={() => {
                    window.location.href = `/product/${product._id}`;
                  }}
                >
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
                  <h3 className="text-lg text-luxury-white font-semibold mb-1">{product.name}</h3>
                  <p className="text-luxury-offwhite mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {product.rating && (
                      <span className="ml-2 text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-5 gap-2">
                    <div className="flex items-center justify-between">
                      {/* Display product price, formatted with commas */}
                      <span className="text-xl p-1 text-luxury-primaryGold font-bold text-green-700">${product.price.toLocaleString()}</span>
                    </div>
                    {/* Add to Cart button triggers handleAddToCart with product ID and quantity 1 */}
                    <button
                      className="bg-luxury-gold-dark text-luxury-white rounded-3xl font-medium px-5 py-3 hover:bg-luxury-primaryGold hover:text-luxury-black transition"
                      onClick={e => {
                        e.stopPropagation(); // Prevent parent click event (e.g., navigation)
                        handleAddToCart(product._id, 1); // Add product to cart
                      }}
                    >
                      {/* Cart icon SVG for visual indication */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <circle cx="9" cy="21" r="1.5" />
                        <circle cx="19" cy="21" r="1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 3H4l2.68 13.39A2 2 0 008.62 18h8.76a2 2 0 001.94-1.61L21.5 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseProducts;