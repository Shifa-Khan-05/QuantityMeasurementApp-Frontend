import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import { validateSignupForm } from '../../utils/validation';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import { showSuccess } from '../../utils/toast';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear general error
    if (error) setError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({ name: '', email: '', password: '', mobile: '' });

    // Validate all fields
    const validation = validateSignupForm(formData.name, formData.email, formData.password, formData.mobile);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      // Store the user's name for immediate login after signup
      localStorage.setItem('loggedInName', formData.name);
      showSuccess('Registration completed successfully. Please login.');
      navigate('/login');
    } catch (err: any) {
      const errorMessage = getBackendErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');

    // Format as XXX-XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('mobile', formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE - VISUAL */}
        <div className="md:w-5/12 bg-indigo-600 p-12 text-white flex-col justify-center items-center relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <img 
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
            alt="Signup visual" 
            className="w-48 h-48 mb-8 object-contain filter invert opacity-90 drop-shadow-2xl relative z-10" 
          />
          <h3 className="text-3xl font-bold mb-4 text-center relative z-10">Join Us</h3>
          <p className="text-indigo-100 text-center text-lg relative z-10 leading-relaxed">
            Create an account and access the unit converter dashboard.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Header & Tabs */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign Up</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">LOGIN</Link>
              <span className="px-5 py-2 text-sm font-bold text-slate-900 bg-white rounded-lg shadow-sm">SIGNUP</span>
            </div>
          </div>

          <p className="text-slate-500 mb-8">
            Return to <Link to="/welcome" className="text-indigo-600 font-medium hover:underline">Home</Link> or <Link to="/converter" className="text-indigo-600 font-medium hover:underline">Converter</Link>.
          </p>

          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                autoComplete="email"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                autoComplete="new-password"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>}
              <p className="mt-2 text-xs text-slate-400 font-medium">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                value={formData.mobile}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                maxLength={12}
                required
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600 font-medium">{errors.mobile}</p>}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3.5 mt-6 rounded-xl font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline hover:text-indigo-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;