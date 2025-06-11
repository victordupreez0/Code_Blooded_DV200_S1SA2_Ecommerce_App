// Main navigation bar for the application. Handles navigation links, authentication state, user role, and responsive mobile menu.
// Shows different links and buttons based on whether the user is logged in and their role (admin/user).

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

const Navbar: React.FC = () => {
  // State for mobile menu toggle (open/close)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for authentication and user role
  const [isAuthenticated, setIsAuthenticated] = useState(false); // True if user is logged in
  const [userRole, setUserRole] = useState<string | null>(null); // 'admin', 'user', or null
  const navigate = useNavigate(); // React Router navigation hook

  // On mount, check authentication and user role from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token); // Set auth state based on token presence
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setUserRole(parsed.role || null); // Set user role from stored user info
        } catch {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    checkAuth();

    // Listen for changes to localStorage (e.g., login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Handle user logout: clear localStorage, update state, redirect
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    localStorage.removeItem('user'); // Remove user info
    setIsAuthenticated(false); // Update auth state
    navigate('/'); // Redirect to home or login
  };

  return (
    <nav className="bg-[#181816]/100 border-b border-luxury-brown-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-luxury-brown-dark font-serif text-2xl font-bold">Billionaire$</span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 mt-4">
            <Link to="/" className="border-transparent text-luxury-brown-dark hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Home
            </Link>
            <Link
              to={isAuthenticated ? "/BrowseProducts" : "/login"}
              className="border-transparent text-luxury-brown-dark hover:text-luxury-brown-dark px-1 pt-1 font-medium"
            >
              Products
            </Link>
            <Link to="/Dashboard" className="border-transparent text-luxury-brown-dark hover:text-luxury-brown-dark px-1 pt-1 font-medium">
              Dashboard
            </Link>
            {/* Show Admin link only for admin users */}
            {userRole === 'admin' && (
              <Link to="/postLogin" className="border-transparent text-luxury-brown-dark hover:text-luxury-brown-dark px-1 pt-1 font-medium">
                Admin
              </Link>
            )}
          </div>
          
          {/* Auth buttons and cart icon */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-luxury-secondaryBG text-luxury-primaryGold hover:bg-luxury-brown-darker px-4 py-2 rounded-md text-sm font-medium"
                >
                  Log Out
                </button>
                <Link
                  to="/cart"
                  className="ml-4 flex items-center justify-center p-2 rounded-md text-luxury-primaryGold hover:text-luxury-gold-dark hover:bg-luxury-brown-light transition relative"
                  title="View Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-luxury-primaryGold hover:text-luxury-brown-dark font-medium mr-4">
                  Sign In
                </Link>
                <Link to="/register" className="bg-luxury-black text-luxury-primaryGold hover:bg-luxury-primaryGold hover:text-luxury-black px-4 py-2 rounded-md p2 font-medium">
                  Register
                </Link>
              </>
            )}
            {/* Mobile menu button (not shown in this excerpt) */}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-black hover:border-luxury-gold-dark"
          >
            Home
          </Link>
          <Link
            to={isAuthenticated ? "/BrowseProducts" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Products
          </Link>
          <Link
            to="/Dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
          >
            Dashboard
          </Link>
          {userRole === 'admin' && (
            <Link
              to="/postLogin"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
              >
                Log Out
              </button>
              {/* <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
              >
                Cart
              </Link> */}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold hover:bg-luxury-brown-dark hover:border-luxury-gold-dark"
              >
                Sign In
              </Link>
              {/* <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-luxury-primaryGold  hover:bg-luxury-brown-light hover:border-luxury-gold-dark"
              >
                Register
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;