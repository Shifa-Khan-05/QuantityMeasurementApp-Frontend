import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccess } from "../../utils/toast";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      try {
        const decodedName = name ? decodeURIComponent(name) : '';
        // If it looks like an email or an empty string, handle smoothly via the generator
        login(token, decodedName.includes('@') ? decodedName : 'user@google.com', decodedName, 'google');
        showSuccess('Logged in with Google successfully.');
        
        // Navigate to dashboard after a brief delay to ensure state is committed
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } catch (err) {
        // If localStorage fails, redirect to login
        navigate("/login", { replace: true });
      }
    } else {
      // No token in URL, redirect to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-700 font-medium">Completing login...</p>
        <p className="text-slate-500 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;