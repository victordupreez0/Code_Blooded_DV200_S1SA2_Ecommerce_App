// User dashboard page for the e-commerce application.
// Displays user info and products created by the user, and allows adding, editing, and deleting user's own products.
// Handles product CRUD operations, form state, and modal UI for product management.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  // State for the logged-in user's name
  const [username, setUsername] = useState('');
  // State for the logged-in user's ID
  const [userId, setUserId] = useState('');
  // State for the list of products created by the user
  const [products, setProducts] = useState([]);
  // State for the product form (add/edit)
  const [form, setForm] = useState({ name: '', price: '', description: '', image: null, category: '' });
  // State for displaying messages (success/error)
  const [message, setMessage] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for showing/hiding the add/edit product modal
  const [showModal, setShowModal] = useState(false);
  // State for the product being edited (if any)
  const [editProduct, setEditProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, get user from localStorage and set username/userId
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUsername(userObj.fullName || userObj.username || 'User');
        setUserId(userObj._id);
      } catch {
        setUsername('User');
        setUserId('');
      }
    } else {
      setUsername('User');
      setUserId('');
      // Optionally, redirect to login if not authenticated
      // navigate('/login');
    }
  }, [navigate]);

  // Fetch only products created by this user
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products for the current user from backend
      const res = await axios.get(`http://localhost:3000/products/user/${userId}`);
      setProducts(res.data);
    } catch (err) {
      setMessage('Error fetching products');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch products when userId is set
    if (userId) fetchProducts();
  }, [userId]);

  // Handle changes in the add/edit product form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'image' && e.target instanceof HTMLInputElement && e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission for adding a new product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('userId', userId); // Attach userId to product
      if (form.image) {
        formData.append('image', form.image);
      }
      await axios.post('http://localhost:3000/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Product under review!');
      setForm({ name: '', price: '', description: '', image: null, category: '' });
      fetchProducts(); // Refresh product list
    } catch (err) {
      setMessage('Error creating product');
    }
  };

  // Handle edit button click: populate form and show modal
  const handleEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null, // User can upload a new image
      category: product.category
    });
    setShowModal(true);
  };

  // Handle form submission for updating an existing product
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('category', form.category);
      if (form.image) {
        formData.append('image', form.image);
      }
      await axios.patch(`http://localhost:3000/products/${editProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Product updated!');
      setForm({ name: '', price: '', description: '', image: null, category: '' });
      setEditProduct(null);
      setShowModal(false);
      fetchProducts(); // Refresh product list
    } catch (err) {
      setMessage('Error updating product');
    }
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter((p: any) => p._id !== id));
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  // Remove the form from the main render, and use a modal instead
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold p-6">
        <div className="w-full max-w-5xl bg-luxury-primaryBG/50 rounded-3xl shadow p-8 mt-8">
          <h1 className="text-2xl font-bold text-luxury-primaryGold mb-4">Welcome to your dashboard @<span className="text-luxury-primaryGold text-2xl">{username || 'User'}</span></h1>
          <h5 className="text-luxury-black text-lg mb-6">Add, edit and manage your products here.</h5>
          {/* User's Products List */}
          <div className="min-h-[300px] rounded-lg flex flex-col gap-4 mb-6 p-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-luxury-black">No products found. Add your first product below!</div>
            ) : (
              <div className="flex flex-col gap-4">
                {products.map((product: any) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center bg-luxury-brown-light/30 rounded shadow-md p-4 cursor-pointer group overflow-hidden hover:bg-luxury-black transition gap-3 sm:gap-0"
                    style={{ minHeight: '100px', maxHeight: 'none' }}
                    onClick={() => {
                      window.location.href = `/product/${product._id}`;
                    }}
                  >
                    <div className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-24 mb-2 sm:mb-0 sm:mr-4 relative group">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:3000${product.imageUrl}`}
                          alt={product.name}
                          className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="text-lg text-luxury-white font-semibold mb-1 break-words whitespace-pre-line">{product.name}</h3>
                      <p className="text-luxury-offwhite mb-1 break-words whitespace-pre-line text-sm" style={{ maxHeight: '4rem', overflowY: 'auto' }}>{product.description}</p>
                      <span className="text-xs text-luxury-primaryGold font-medium">{product.category}</span>
                      {product.status === 'pending' && (
                        <span className="ml-2 text-yellow-500 font-bold">Pending Review</span>
                      )}
                      {product.status === 'denied' && (
                        <span className="ml-2 text-red-500 font-bold">Denied</span>
                      )}
                      {product.status === 'approved' && (
                        <span className="ml-2 text-green-500 font-bold">Approved</span>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col items-end justify-between sm:ml-4 w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                      <span className="text-xl text-luxury-primaryGold font-bold">${product.price.toLocaleString()}</span>
                      {product.rating && (
                        <span className="text-yellow-500 text-sm">{'★'.repeat(Math.round(product.rating))}</span>
                      )}
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                          onClick={e => { e.stopPropagation(); handleEdit(product); }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                          onClick={e => { e.stopPropagation(); handleDelete(product._id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-luxury-primaryGold text-luxury-black font-semibold rounded shadow hover:bg-luxury-black hover:text-luxury-white transition"
              onClick={() => setShowModal(true)}
            >
              Add New Product
            </button>
          </div>
        </div>
        {/* Modal for Add Product */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-luxury-primaryBG rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-luxury-primaryGold hover:text-white text-2xl font-bold"
                onClick={() => { setShowModal(false); setEditProduct(null); }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-luxury-primaryGold">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={editProduct ? handleUpdate : handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label className="block mb-1 font-medium text-white">Name</label>
                  <input type="text" className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">Price</label>
                  <input type="number" className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25" name="price" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">Description</label>
                  <textarea className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25" name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">Image</label>
                  <input type="file" className="luxury-input w-full bg-luxury-black/40 text-white/45 rounded border border-luxury-primaryGold file:bg-black file:text-white file:rounded-xl file:border-0 file:px-4 file:py-2 file:cursor-pointer file:font-medium file:transition file:hover:bg-luxury-brown-darker placeholder:text-luxury-white/25" name="image" accept="image/*" onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-white">Category</label>
                  <select className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Property">Property</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-luxury-primaryGold text-luxury-black rounded hover:bg-black hover:text-white transition font-semibold">{editProduct ? 'Update Product' : 'Add Product'}</button>
                {message && <div className="mt-2 p-2 rounded bg-blue-100 text-blue-800 border border-blue-300">{message}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
