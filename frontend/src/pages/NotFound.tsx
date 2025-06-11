// 404 Not Found page
// Displays a user-friendly message when a user navigates to a route that does not exist.
// Provides a link to return to the home page.

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold">
      {/* Large 404 error code */}
      <h1 className="text-6xl font-bold text-luxury-black mb-4">404</h1>
      {/* Main not found message */}
      <p className="text-xl text-luxury-black mb-8">Page not found</p>
      {/* Additional explanation for the user */}
      <p className="text-luxury-black max-w-md text-center mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      {/* Button to return to the home page */}
      <Link
        to="/"
        className="bg-luxury-black text-luxury-primaryGold px-6 py-3 rounded-md text-sm font-medium hover:bg-luxury-brown-darker transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
