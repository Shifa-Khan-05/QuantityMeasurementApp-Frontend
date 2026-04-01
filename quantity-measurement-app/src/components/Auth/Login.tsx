import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { validateLoginForm } from '../../utils/validation';
import { getBackendErrorMessage } from '../../utils/errorHandler';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccess } from '../../utils/toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authenticateUser } = useAuth();

  // ✅ Google OAuth redirect (BACKEND FLOW)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({ email: '', password: '' });
    setIsLoading(true);

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      authenticateUser(response.token, email, response.name, 'local');
      showSuccess('Login successful! Welcome back.');

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = getBackendErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            alt="Login visual"
            className="w-48 h-48 mb-8 object-contain filter invert opacity-90 drop-shadow-2xl relative z-10"
          />
          <h3 className="text-3xl font-bold mb-4 text-center relative z-10">Welcome Back</h3>
          <p className="text-indigo-100 text-center text-lg relative z-10 leading-relaxed">
            Log in to access your unit converter dashboard instantly.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Header & Tabs */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <span className="px-5 py-2 text-sm font-bold text-slate-900 bg-white rounded-lg shadow-sm">LOGIN</span>
              <Link to="/signup" className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">SIGNUP</Link>
            </div>
          </div>

          <p className="text-slate-500 mb-8">
            Return to <Link to="/welcome" className="text-indigo-600 font-medium hover:underline">Home</Link> or <Link to="/converter" className="text-indigo-600 font-medium hover:underline">Converter</Link>.
          </p>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                autoComplete="email"
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="you@example.com"
                required
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                autoComplete="current-password"
                className={`w-full px-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>

          {/* GOOGLE LOGIN */}
          <div className="mt-10 mb-6 flex items-center justify-center">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="px-4 text-sm font-bold text-slate-400">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-700 py-3.5 rounded-xl font-bold border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-3 text-base"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            Continue with Google
          </button>
          
          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline hover:text-indigo-700">Create an account</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;