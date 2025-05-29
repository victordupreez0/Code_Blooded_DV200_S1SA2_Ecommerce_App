import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import CommentSection from '../components/CommentSection';
import "../components/styling/main.css";

const BrowseProducts: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex">
        {/* Sidebar Filter */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block mx-5 my-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <ul className="space-y-1">
                {['All', 'Rich', 'Richer', 'Richest'].map((cat) => (
                  <li key={cat}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${selectedCategory === cat ? 'bg-blue-100 font-bold' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Price Filter */}
            <div>
              <h3 className="font-medium mb-2">Price</h3>
              <ul className="space-y-1">
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">Under $1B</button></li>
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">$1B - $100B</button></li>
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">$100B+</button></li>
              </ul>
            </div>
            {/* Rating Filter */}
            <div>
              <h3 className="font-medium mb-2">Rating</h3>
              <ul className="space-y-1">
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">4★ & up</button></li>
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">3★ & up</button></li>
                <li><button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">All Ratings</button></li>
              </ul>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 p-6">
          {loading && <div>Loading products...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {filteredProducts.map((product: Product) => (
                <div
                  key={product._id}
                  className="product-card rounded-lg shadow-md p-4 flex flex-col cursor-pointer hover:ring-2 hover:ring-blue-400"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowCommentModal(true);
                  }}
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:3000${product.imageUrl}`}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded mb-3"
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-green-700">${product.price.toLocaleString()}</span>
                    {product.rating && (
                      <span className="ml-2 text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Modal for Comment Section */}
          {showCommentModal && selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowCommentModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Comments for {selectedProduct.name}</h2>
                <CommentSection productId={selectedProduct._id} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseProducts;