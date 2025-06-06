import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import "../components/styling/main.css";
import axios from 'axios';
import { FaFlag } from 'react-icons/fa';





const BrowseProducts: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');

  const getUniqueCategories = (products: Product[]) => {
  const cat = new Set<string>();
  products.forEach(p => p.category && cat.add(p.category));
  return Array.from(cat);

 
};

 const resetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
  };

const categories = getUniqueCategories(products);

const filteredProducts = products.filter((product) => {
  let pass = true;
  if (selectedCategory !== 'All' && product.category !== selectedCategory) 
    pass = false;
    if(minPrice && Number(product.price) < Number(minPrice)) pass = false;
    if(maxPrice && Number(product.price) > Number(maxPrice)) pass = false; 
    if(minRating && (!product.rating || product.rating < Number(minRating))) pass = false;
    return pass;
  });
      
   

  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex">
        {/* Sidebar Filter */}
       <aside className="fixed top-[80px] left-5 h-fit-content w-52 border-r border-luxury-primaryGold p-4 z-40 hidden md:block">
 
  <div className="space-y-6">
    {/* Category Filter */}
    <div>
      <h3 className="font-semibold mb-2 text-luxury-white tracking-wide uppercase text-l">Category</h3>
      <ul className="space-y-1">
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
    {/* Price Filter */}
    <div>
      <h3 className="font-semibold mb-2 text-luxury-white tracking-wide uppercase text-l">Price</h3>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="Min"
          className="w-20 px-2 py-1 rounded border border-luxury-primaryGold bg-white text-black"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <span className="text-luxury-white">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-1 rounded border border-luxury-primaryGold bg-white text-black"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
    {/* Rating Filter */}
    <div>
      <h3 className="font-semibold mb-2 text-luxury-white tracking-wide uppercase text-l">Min Rating</h3>
      <select
        className="w-full px-2 py-1 rounded border border-luxury-primaryGold bg-white text-black"
        value={minRating}
        onChange={e => setMinRating(e.target.value)}
      >
        <option value="">Any</option>
        <option value="1">1★</option>
        <option value="2">2★</option>
        <option value="3">3★</option>
        <option value="4">4★</option>
        <option value="5">5★</option>
      </select>
    </div>
    {/* Reset Button */}
    <button
      className="w-full mt-2 py-2 bg-luxury-brown-light text-black rounded font-semibold hover:bg-luxury-gold-medium transition"
      onClick={resetFilters}
    >
      Reset Filters
    </button>
  </div>
</aside>




        
        
        {/* Main Content */}
        <div className="flex-1 p-6 md:ml-64"> {/* <-- Add md:ml-64 here */}
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
                    {/* Gradient overlay, hidden on hover of the card */}
                    
                  </div>
                  <h3 className="text-lg text-luxury-white font-semibold mb-1">{product.name}</h3>
                  <p className="text-luxury-offwhite  mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {/* <span className="text-l text-luxury-primaryGold font-bold text-green-700">${product.price.toLocaleString()}</span> */}
                    {product.rating && (
                      <span className="ml-2 text-yellow-500">{'★'.repeat(Math.round(product.rating))}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-5 gap-2">
                     <div className="flex items-center justify-betweenS">
                    <span className="text-xl p-1 text-luxury-primaryGold font-bold text-green-700">${product.price.toLocaleString()}</span>
                  </div>
                    
                    {/* <FaFlag
                      className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                      title="Flag this product"
                      size={18}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const reason = prompt('why flag this');
                        if (reason) {
                          await axios.post(`http://localhost:3000/products/${product._id}/flag`, { reason });
                          alert('Product flagged success');
                        }
                      }}
                    /> */}
                    <button
                      className=" bg-luxury-gold-dark text-luxury-white rounded-3xl font-medium px-5 py-3  hover:bg-luxury-primaryGold hover:text-luxury-black transition"
                      onClick={e => {
                        e.stopPropagation();
                        // Add to cart logic (user-specific)
                        const user = localStorage.getItem('user');
                        if (!user) {
                          window.location.href = '/login';
                          return;
                        }
                        const userId = JSON.parse(user)._id;
                        const cartKey = `cart_${userId}`;
                        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                        const existing = cart.find((item: any) => item._id === product._id);
                        if (existing) {
                          existing.quantity = (existing.quantity || 1) + 1;
                        } else {
                          cart.push({ ...product, quantity: 1 });
                        }
                        localStorage.setItem(cartKey, JSON.stringify(cart));
                      }}
                    >
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
          {/* Modal for Comment Section */}
          {/* {showCommentModal && selectedProduct && (
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
          )} */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseProducts;