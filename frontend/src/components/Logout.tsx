import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    console.log('Logging out, clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: "Success",
      description: "Logged out successfully. Redirecting to login...",
    });
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-brown-light/50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-luxury-black">Log out</h2>
        <p className="mt-2 text-center text-sm text-luxury-brown-dark">
          Are you sure you want to log out?
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-luxury-brown-light">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-luxury-black hover:bg-luxury-brown-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold-dark transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;