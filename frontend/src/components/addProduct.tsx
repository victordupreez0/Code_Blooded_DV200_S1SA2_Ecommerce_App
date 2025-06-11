import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category: ''
  });
  const [message, setMessage] = useState('');
  const [view, setView] = useState('add'); // 'add' or 'view'
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
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
      await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product created!');
      setForm({ name: '', price: '', description: '', image: null, category: '' });
    } catch (err) {
      setMessage('Error creating product');
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
    } catch (err) {
      setMessage('Error fetching products');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'view') fetchProducts();
  }, [view]);

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  function setShowCommentModal(arg0: boolean) {
    throw new Error('Function not implemented.');
  }

  function setSelectedProduct(product: any) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl text-luxury-black font-bold">{view === 'add' ? 'Add Product' : 'View/Search Products'}</h2>
        <button
          className="px-4 py-2 bg-luxury-primaryGold text-luxury-black rounded-lg hover:bg-luxury-primaryBG hover:text-luxury-white transition"
          onClick={() => setView(view === 'add' ? 'view' : 'add')}
        >
          {view === 'add' ? 'View/Search Products' : 'Add Product'}
        </button>
      </div>
      <div className={view === 'add' ? '' : ''}>
        {view === 'add' && (
          <div className=" flex flex-col justify-center py-2 sm:px-6 lg:px-8 mb-10">
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-luxury-black">Add a new product</h2>
        </div> */}
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-luxury-primaryBG/50 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-luxury-brown-light">
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-luxury-white">Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25"
                    placeholder="Product name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-white">Price</label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    required
                    value={form.price}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25"
                    placeholder="Product price"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-white">Description</label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    required
                    value={form.description}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white/25"
                    placeholder="Product description"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-white">Image</label>
                <div className="mt-1">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black/40 text-white/45 rounded border border-luxury-primaryGold file:bg-black file:text-white file:rounded-xl file:border-0 file:px-4 file:py-2 file:cursor-pointer file:font-medium file:transition file:hover:bg-luxury-brown-darker placeholder:text-luxury-white/25"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-white">Category</label>
                <div className="mt-1">
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black/40 text-white placeholder:text-luxury-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Property">Property</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-luxury-primaryGold bg-luxury-black hover:bg-luxury-brown-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold-dark transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
            {message && (
              <div className="mt-4 p-3 rounded bg-blue-100 text-blue-800 border border-blue-300">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
        )}
        {view === 'view' && (
          <div className="w-full mb-10">
            <input
              type="text"
              className="w-full mb-4 border bg-luxury-primaryBG border-luxury-primaryGold rounded-3xl text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-luxury-primaryGold placeholder:text-luxury-white/50"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <ul className="space-y-3">
                {filteredProducts.length === 0 && (
                  <li className="p-4 rounded text-center text-black">No products found.</li>
                )}
                {filteredProducts.map(product => (
                  <li
                    key={product._id}
                    className="relative flex flex-col justify-between h-full p-4 bg-luxury-primaryBG/80 rounded-2xl shadow cursor-pointer hover:bg-luxury-primaryBG/30 transition"
                    onClick={() => window.location.href = `/product/${product._id}`}
                  >
                    {/* Flagged reason in top right */}
                    {product.flagged && product.flagReason && (
                      <div className="absolute top-4 right-4 flex flex-col items-end z-10">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">Flagged</span>
                        <span className="text-xs text-white mt-1 text-right max-w-[150px] break-words">Reason: {product.flagReason}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {product.imageUrl && (
                        <img
                          src={`http://localhost:3000${product.imageUrl}`}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-white">{product.name}</span>
                        <span className="ml-2 text-luxury-primaryGold">${product.price}</span>
                        <div className="text-sm text-white/80 max-w-[80%] break-words">{product.description}</div>
                      </div>
                    </div>
                    {/* Delete button to the right */}
                    <div className="flex gap-2 justify-end mt-2" onClick={e => e.stopPropagation()}>
                      <button
                        className="px-3 py-1 bg-luxury-primaryBG text-white rounded-xl hover:bg-red-600 transition"
                        onClick={() => handleDelete(product._id)}
                        tabIndex={0}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;