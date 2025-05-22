import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null
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
      if (form.image) {
        formData.append('image', form.image);
      }
      const res = await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product created!');
      setForm({ name: '', price: '', description: '', image: null });
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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{view === 'add' ? 'Add Product' : 'View/Search Products'}</h2>
        <button className="btn btn-secondary" onClick={() => setView(view === 'add' ? 'view' : 'add')}>
          {view === 'add' ? 'View/Search Products' : 'Add Product'}
        </button>
      </div>
      <div className="row">
        <div className="col-md-6">
          {view === 'add' && (
            <form onSubmit={handleSubmit} className="mt-4" encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
          )}
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
        <div className="col-md-6">
          {view === 'view' && (
            <div>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ul className="list-group">
                  {filteredProducts.length === 0 && <li className="list-group-item">No products found.</li>}
                  {filteredProducts.map(product => (
                    <li key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{product.name}</strong> (${product.price})<br />
                        <small>{product.description}</small>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
