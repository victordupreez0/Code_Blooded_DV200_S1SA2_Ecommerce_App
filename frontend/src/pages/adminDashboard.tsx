// Admin dashboard page for the application. Provides a UI for admin users to manage products.
// Renders the navigation bar, product management component, and footer in a styled layout.

import React from 'react';
import Navbar from '../components/Navbar'; // Top navigation bar
import Footer from '../components/Footer'; // Bottom footer
import AddProduct from '../components/addProduct'; // Admin product management UI

// Main component for the admin dashboard (post-login admin view)
const PostLogin: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold">
      <Navbar /> {/* Render the navigation bar at the top */}
      <main className="flex-grow">
        <AddProduct /> {/* Render the admin product management UI */}
      </main>
      <Footer /> {/* Render the footer at the bottom */}
    </div>
  );
};

export default PostLogin;
