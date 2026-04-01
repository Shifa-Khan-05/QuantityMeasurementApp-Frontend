import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ChevronRight } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <AlertCircle size={64} />
          </div>
          
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-buttons">
            <button 
              onClick={() => navigate('/')}
              className="btn-primary-404"
            >
              <Home size={18} />
              Back to Home
            </button>
            
            <button 
              onClick={() => navigate('/converter')}
              className="btn-secondary-404"
            >
              <span>Go to Converter</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
