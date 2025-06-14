// viewProduct.tsx
// Displays a single product's details, allows users to add to cart, flag the product, and view/add comments.
// Handles product fetching, error/loading states, flagging modal, and integrates with cart and comment systems.

// Import React and required hooks
import React, { useEffect, useState } from 'react'; // useEffect for lifecycle, useState for local state
import { useParams, useNavigate } from 'react-router-dom'; // useParams to get product ID from URL, useNavigate for navigation
import axios from 'axios'; // For HTTP requests
import Navbar from './Navbar'; // Navigation bar component
import Footer from './Footer'; // Footer component
import CommentSection from './CommentSection'; // Comments UI for product
import { FaFlag } from 'react-icons/fa'; // Flag icon for reporting

// Helper function to add a product to the cart
const handleAddToCart = async (productId: string, quantity = 1) => {
    // Log the productId and token presence for debugging
    console.log('Adding productId:', productId, 'Token present:', !!localStorage.getItem('token'));
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage
    if (!token) {
      // If no token, redirect to login and clear local storage
      console.log('No token found, redirecting to login');
      window.location.href = '/login';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
    try {
      // Make POST request to add product to cart
      const res = await axios.post('http://localhost:3000/api/cart/add', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Add to cart response:', res.data); // Log response
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

// Main component for viewing a single product
const ViewProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // For navigation (e.g., back button)
  const [product, setProduct] = useState(null); // Product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error message
  const [showFlagModal, setShowFlagModal] = useState(false); // Modal for flagging
  const [flagReason, setFlagReason] = useState(''); // Reason for flagging
  const [flagMessage, setFlagMessage] = useState(''); // Success/failure message for flag

  // Fetch product details when component mounts or id changes
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch product by ID
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data); // Set product data
      } catch (err) {
        setError('Error fetching product'); // Set error if fetch fails
      }
      setLoading(false); // Stop loading
    };
    fetchProduct();
  }, [id]);

  // Render UI
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* Top navigation bar */}
      {/* Flag Reason Modal - appears when user wants to flag a product */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-luxury-primaryBG rounded-2xl shadow-lg p-6 w-full max-w-md relative text-white">
            <button
              className="absolute top-2 right-2 text-white hover:text-gray-200 text-2xl font-bold"
              onClick={() => setShowFlagModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Flag Product</h2>
            <label className="block mb-2 font-medium">Reason for flagging:</label>
            <textarea
              className="w-full border border-luxury-primaryGold rounded px-3 py-2 mb-4 bg-luxury-black/40 text-white focus:outline-none focus:ring-0 placeholder:text-white/70"
              value={flagReason} // Controlled input for flag reason
              onChange={e => setFlagReason(e.target.value)} // Update flag reason state
              placeholder="Enter reason..."
              rows={3}
              autoFocus
            />
            {/* Show success/failure message after flagging */}
            {flagMessage && <div className="mb-2 text-green-200 font-medium">{flagMessage}</div>}
            <div className="flex gap-2 justify-end">
              {/* Cancel closes the flag modal */}
              <button
                className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30"
                onClick={() => setShowFlagModal(false)}
              >
                Cancel
              </button>
              {/* Submit sends flag request to backend, disables if input is empty */}
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => {
                  if (!flagReason.trim()) return; // Prevent empty reason
                  try {
                    // Send flag request to backend
                    await axios.post(`http://localhost:3000/products/${product._id}/flag`, { reason: flagReason });
                    setFlagMessage('Product flagged successfully!');
                    setTimeout(() => {
                      setShowFlagModal(false);
                      setFlagReason('');
                      setFlagMessage('');
                    }, 1200);
                  } catch {
                    setFlagMessage('Failed to flag product.');
                  }
                }}
                disabled={!flagReason.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 flex flex-col items-center bg-luxury-black py-10">
        {/* Main content area */}
        <div className="flex-1 flex justify-center items-center w-full">
          {loading ? (
            // Show loading spinner or text
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            // Show error message if fetch failed
            <div className="text-red-500">{error}</div>
          ) : product ? (
            // Product details card
            <div className="bg-luxury-primaryBG rounded-3xl shadow-lg p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">
              {/* Action buttons (back, flag, add to cart) */}
              <div className="flex flex-col gap-2">
                <button
                  className="mb-2 bg-luxury-primaryGold text-black hover:text-white px-4 py-2 rounded-3xl hover:bg-luxury-brown-darker transition self-start"
                  onClick={() => navigate(-1)} // Go back to previous page
                >
                  &larr;
                </button>
                <button
                  className="bg-luxury-primaryGold text-black hover:text-white px-4 py-2 rounded-3xl hover:bg-luxury-brown-darker transition self-start flex items-center gap-2"
                  onClick={e => {
                    e.stopPropagation();
                    setShowFlagModal(true); // Open flag modal
                  }}
                  title="Flag this product"
                >
                  <FaFlag className="text-red-500" size={18} />
                </button>
                <button
                  className="bg-luxury-primaryGold text-black hover:text-white px-3 py-1 rounded-3xl hover:bg-luxury-brown-darker transition self-start flex items-center gap-2 mt-2"
                  title="Add to cart"
                  onClick={e => {
                        e.stopPropagation();
                        handleAddToCart(product._id, 1); // Add product to cart
                      }}
                >
                  {/* Cart icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <circle cx="9" cy="21" r="1.5" />
                    <circle cx="19" cy="21" r="1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 3H4l2.68 13.39A2 2 0 008.62 18h8.76a2 2 0 001.94-1.61L21.5 6H6" />
                  </svg>
                </button>
                {/* Add more vertically stacked action buttons here if needed */}
              </div>
              {/* Product image and details */}
              <div className="flex-1 flex flex-col justify-center">
                {product.imageUrl && (
                  <img
                    src={`http://localhost:3000${product.imageUrl}`}
                    alt={product.name}
                    className="w80 h-50 object-cover rounded-xl border border-luxury-primaryGold mx-auto md:mx-0 mb-4"
                  />
                )}
                <h1 className="text-3xl text-luxury-white font-bold mb-2">{product.name}</h1>
                <p className="text-xl text-luxury-primaryGold mb-4">${product.price}</p>
                <p className="text-luxury-white mb-4">{product.description}</p>
                {/* Add more product details here if needed */}
              </div>
              {/* Comments section for the product */}
              <div className="w-full md:w-[400px] flex flex-col">
                <h2 className="text-xl text-luxury-white font-semibold mb-4">Comments</h2>
                <CommentSection productId={product._id} />
              </div>
            </div>
          ) : (
            // If product not found
            <div className="text-gray-500">Product not found.</div>
          )}
        </div>
      </main>
      <Footer /> {/* Bottom footer */}
    </div>
  );
};

export default ViewProduct;
