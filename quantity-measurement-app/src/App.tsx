import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Welcome from './components/Layout/Welcome';
import { Toaster } from 'sonner';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Converter/Dashboard';
import Navbar from './components/Layout/Navbar';

import OAuthSuccess from './components/Auth/OAuthSuccess';
import NotFound from './components/Layout/NotFound';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <div className="font-sans min-h-screen bg-slate-50 text-slate-900">
        <Router>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:z-50 rounded-br-lg">
          Skip to main content
        </a>
        
        <Navbar />
        
        <main id="main-content" className="min-h-[calc(100vh-64px)]">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/converter" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/oauth-callback" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;