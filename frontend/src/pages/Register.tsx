import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast.ts';
import axios from 'axios';
import Navbar from '../components/Navbar.tsx';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Password Error",
        description: "Password must be at least 8 characters, and include uppercase, lowercase, and numbers",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/register', {
        fullName,
        email,
        password
      });
      toast({
        title: "Success",
        description: "Account created successfully. Redirecting to login...",
      });
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const isPasswordValid = validatePassword(formData.password);
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-luxury-black">Create your account</h2>
          <p className="mt-2 text-center text-sm text-luxury-brown-dark">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-luxury-gold-dark hover:text-luxury-brown-dark">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-luxury-primaryBG py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-luxury-brown-light">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-luxury-white">
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black text-white placeholder:text-luxury-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-luxury-white">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="luxury-input w-full bg-luxury-black text-white placeholder:text-luxury-white"
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`luxury-input w-full pr-10 bg-luxury-black text-white placeholder:text-luxury-white ${formData.password && (isPasswordValid ? 'border-green-500' : 'border-red-500')}`}
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
                <p className="mt-1 text-xs text-luxury-brown-dark">
                  Password must be at least 8 characters, and include uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-luxury-white">
                  Confirm password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`luxury-input w-full pr-10 bg-luxury-black text-white placeholder:text-luxury-white ${formData.confirmPassword && (doPasswordsMatch ? 'border-green-500' : 'border-red-500')}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-luxury-brown-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-luxury-brown-dark" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-luxury-gold-dark focus:ring-luxury-gold-dark border-luxury-brown-light rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-luxury-white">
                  I agree to the{' '}
                  <Link to="/terms" className="text-luxury-primaryGold hover:text-luxury-brown-dark">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-luxury-primaryGold hover:text-luxury-brown-dark">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-luxury-black hover:bg-luxury-brown-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold-dark transition-colors"
                >
                  Create account
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

export default Register;