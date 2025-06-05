import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import CommentSection from './CommentSection';
import { FaFlag } from 'react-icons/fa';

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
      <main className="flex-1 flex flex-col items-center bg-luxury-black py-10">
       
        <div className="flex-1 flex justify-center items-center w-full">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : product ? (
            <div className="bg-luxury-primaryBG rounded-3xl shadow-lg p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8">
              <div className="flex flex-col gap-2">
                <button
                  className="mb-2 bg-luxury-primaryGold text-black hover:text-white px-4 py-2 rounded-3xl hover:bg-luxury-brown-darker transition self-start"
                  onClick={() => navigate(-1)}
                >
                  &larr;
                </button>
                <button
                  className="bg-luxury-primaryGold text-black hover:text-white px-4 py-2 rounded-3xl hover:bg-luxury-brown-darker transition self-start flex items-center gap-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const reason = prompt('why flag this');
                    if (reason) {
                      await axios.post(`http://localhost:3000/products/${product._id}/flag`, { reason });
                      alert('Product flagged success');
                    }
                  }}
                  title="Flag this product"
                >
                  <FaFlag className="text-red-500" size={18} />
                </button>
                {/* Add more vertically stacked action buttons here if needed */}
              </div>
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
              <div className="w-full md:w-[400px] flex flex-col">
                <h2 className="text-xl text-luxury-white font-semibold mb-4">Comments</h2>
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
