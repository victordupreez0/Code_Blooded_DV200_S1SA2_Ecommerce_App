import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddProduct from '../components/addProduct';

const PostLogin: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold">
      <Navbar />
      <main className="flex-grow">
      <AddProduct />
      </main>
      <Footer />
    </div>
  );
};

export default PostLogin;
