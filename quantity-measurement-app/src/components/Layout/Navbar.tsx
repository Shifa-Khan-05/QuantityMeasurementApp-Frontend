import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Box, LogOut, Home, LayoutDashboard,Calculator, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showSuccess } from '../../utils/toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully.');
    navigate('/welcome', { replace: true });
  };

  const publicLinks = [
    { name: 'Home', path: '/welcome', icon: <Home size={18} /> },
    { name: 'Converter', path: '/converter', icon: <Calculator size={18} /> },
  ];

  const privateLinks = [
    { name: 'Home', path: '/welcome', icon: <Home size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> }
   
  ];

  const navLinks = isAuthenticated ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/welcome" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-indigo-200">
              <Box size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block">
              Quantity<span className="text-indigo-600">App</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path || (link.path === '/welcome' && location.pathname === '/')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.icon}
                <span className="hidden md:inline">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Profile & Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative group">
                <div className="flex items-center gap-3 cursor-pointer p-1 pr-4 rounded-full border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full text-sm shadow-md shadow-indigo-200">
                    {user.initials}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block truncate max-w-[120px]">
                    {user.name}
                  </span>
                </div>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    {user.provider === 'google' && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Google Account</span>
                    )}
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                      <LayoutDashboard size={16} className="text-slate-400" /> Dashboard
                    </Link>
                    <Link to="/dashboard#history-section" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                      <History size={16} className="text-slate-400" /> History
                    </Link>
                   
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
