import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast.ts';
import axios from 'axios';
import Navbar from '../components/Navbar.tsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate(); // For redirect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: res.data.user._id,
        fullName: res.data.user.fullName,
        role: res.data.user.role // Save role in localStorage
      }));
      toast({
        title: "Success",
        description: "Login successful. Redirecting...",
      });
      setTimeout(() => {
        navigate('/browseProducts'); // Redirect after login
      }, 1000);
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (

    <>
    <Navbar />
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-luxury-black">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-luxury-brown-dark">
          Or{' '}
          <Link to="/register" className="font-medium text-luxury-gold-dark hover:text-luxury-brown-dark">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-luxury-primaryBG py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-luxury-brown-light">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-luxury-white">
                Email address
              </label>
              <div className="mt-1">
                <input 
                 className="luxury-input w-full bg-luxury-black text-white placeholder:text-luxury-white"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-luxury-white">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="luxury-input w-full bg-luxury-black text-white placeholder:text-luxury-white focus:border-luxury-primaryGold"
// ...other props
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-luxury-brown-dark" />
                  ) : (
                    <Eye className="h-5 w-5 text-luxury-brown-dark" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-luxury-gold-dark focus:ring-luxury-gold-dark border-luxury-brown-light rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-luxury-brown-dark">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-luxury-gold-dark hover:text-luxury-brown-dark">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-luxury-black hover:bg-luxury-brown-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold-dark transition-colors">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-luxury-brown-light"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-luxury-brown-dark">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-luxury-brown-light rounded-md shadow-sm bg-white text-sm font-medium text-luxury-black hover:bg-luxury-brown-light transition-colors"
                >
                  Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-luxury-brown-light rounded-md shadow-sm bg-white text-sm font-medium text-luxury-black hover:bg-luxury-brown-light transition-colors"
                >
                  Apple
                </a>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    </>
  ); 
};

export default Login;