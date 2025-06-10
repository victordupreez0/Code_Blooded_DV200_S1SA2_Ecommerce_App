import React , { useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Product} from '../types/product';


const Features: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
     const navigate = useNavigate();


useEffect(() => {
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if(!token){
      console.log('No token found');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/products', {
          headers: { Authorization: `Bearer ${token}` },
      });
      //Randomize
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0,5);
      setProducts(selectedProducts);
        setLoading(false);
    }catch(err:any) {
      console.error('Failed to fetch products:', err.response?.data || err.message);
      if (err.response?.status === 401) {
              console.log('Unauthorized, clearing token and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load products');
          setLoading(false);
        }
      }
    };

fetchProducts();
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
        <h2 className="text-3xl font-extrabold text-luxury-black text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-luxury-brown-light rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:3000${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} // Fallback image
                  />
                )}
              </div>
              <h3 className="text-lg font-medium text-luxury-black mb-1">{product.name}</h3>
              <p className="text-sm text-luxury-brown-dark text-center">${product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  




export default Features;