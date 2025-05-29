import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-luxury-brown-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-luxury-gold-dark font-serif text-2xl font-bold">Billionares</span>
            </Link>
          </div>


          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 mt-4">
            <Link to="/" className="border-transparent text-luxury-black hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Home
            </Link>
            <Link to="/link-1" className="border-transparent text-luxury-black hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Link 1
            </Link>
            <Link to="/link-2" className="border-transparent text-luxury-black hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Link 2
            </Link>
            <Link to="/BrowseProducts" className="border-transparent text-luxury-black hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Browse
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/login" className="text-luxury-black hover:text-luxury-brown-dark font-medium mr-4">
              Sign In
            </Link>
            <Link to="/register" className="bg-luxury-black text-white hover:bg-luxury-brown-darker px-4 py-2 rounded-md text-sm font-medium">
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-luxury-gold-dark"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-black hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Home
          </Link>
          <Link 
            to="/link-1"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-black hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Link 1
          </Link>
          <Link 
            to="/link-2"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-black hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Link 2
          </Link>
          <Link 
            to="/link-3"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-black hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Link 3
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;