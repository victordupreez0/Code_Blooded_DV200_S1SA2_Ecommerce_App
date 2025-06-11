import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-2">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-xs text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/careers" className="text-xs text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link to="/press" className="text-xs text-gray-300 hover:text-white">Press</Link></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-xs text-gray-300 hover:text-white">Terms</Link></li>
              <li><Link to="/privacy" className="text-xs text-gray-300 hover:text-white">Privacy</Link></li>
              <li><Link to="/cookies" className="text-xs text-gray-300 hover:text-white">Cookies</Link></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-xs text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="text-xs text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-xs text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-4">Social</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-gray-300 hover:text-white">Instagram</a></li>
              <li><a href="#" className="text-xs text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-xs text-gray-300 hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-luxury-brown-medium pt-2">
          <p className="text-center text-white text-xs sm:text-sm">&copy; {new Date().getFullYear()} acquire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;