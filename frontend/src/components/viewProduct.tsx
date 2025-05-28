import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import CommentSection from './CommentSection';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Error fetching product');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center bg-gray-50 py-10">
        <button
          className="mb-6 self-start bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ml-4"
          onClick={() => navigate('/postLogin')}
        >
          &larr; Back to Products
        </button>
        <div className="flex-1 flex justify-center items-center w-full">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : product ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col justify-center">
                {product.imageUrl && (
                  <img
                    src={`http://localhost:3000${product.imageUrl}`}
                    alt={product.name}
                    className="w-48 h-48 object-cover rounded border mx-auto md:mx-0 mb-4"
                  />
                )}
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-xl text-gray-700 mb-4">${product.price}</p>
                <p className="text-gray-600 mb-4">{product.description}</p>
                {/* Add more product details here if needed */}
              </div>
              <div className="w-full md:w-[400px] flex flex-col">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <CommentSection productId={product._id} />
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Product not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewProduct;
