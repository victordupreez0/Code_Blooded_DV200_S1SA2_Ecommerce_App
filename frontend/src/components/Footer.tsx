import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-brown-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-medium text-luxury-black mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-luxury-brown-dark hover:text-luxury-black">About</Link></li>
              <li><Link to="/careers" className="text-luxury-brown-dark hover:text-luxury-black">Careers</Link></li>
              <li><Link to="/press" className="text-luxury-brown-dark hover:text-luxury-black">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-luxury-black mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-luxury-brown-dark hover:text-luxury-black">Terms</Link></li>
              <li><Link to="/privacy" className="text-luxury-brown-dark hover:text-luxury-black">Privacy</Link></li>
              <li><Link to="/cookies" className="text-luxury-brown-dark hover:text-luxury-black">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-luxury-black mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-luxury-brown-dark hover:text-luxury-black">Help Center</Link></li>
              <li><Link to="/contact" className="text-luxury-brown-dark hover:text-luxury-black">Contact Us</Link></li>
              <li><Link to="/faq" className="text-luxury-brown-dark hover:text-luxury-black">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-luxury-black mb-4">Social</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-luxury-brown-dark hover:text-luxury-black">Instagram</a></li>
              <li><a href="#" className="text-luxury-brown-dark hover:text-luxury-black">Twitter</a></li>
              <li><a href="#" className="text-luxury-brown-dark hover:text-luxury-black">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-luxury-brown-medium pt-8">
          <p className="text-center text-luxury-brown-dark">&copy; {new Date().getFullYear()} acquire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;