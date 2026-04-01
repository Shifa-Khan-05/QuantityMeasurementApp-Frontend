import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type AuthProviderType = 'local' | 'google';

export interface User {
  name: string;
  email: string;
  provider: AuthProviderType;
  initials: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, email: string, name?: string, provider?: AuthProviderType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const generateInitials = (ident: string): string => {
  if (!ident) return 'U';
  const clean = ident.trim();
  
  if (clean.includes('@')) {
    // It's an email
    return clean.charAt(0).toUpperCase();
  }

  const parts = clean.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  
  return clean.substring(0, 2).toUpperCase() || 'U';
};

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading as we parse localStorage
  });

  // Verify and load token on bootstrap
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('authUserPayload');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          // If token exists but no user payload, fallback to legacy local config or logout
          const oldName = localStorage.getItem('loggedInName');
          const oldEmail = localStorage.getItem('loggedInUser') || '';
          
          if (token && (oldName || oldEmail)) {
             const user: User = {
               name: oldName || oldEmail.split('@')[0],
               email: oldEmail,
               provider: 'local',
               initials: generateInitials(oldName || oldEmail)
             };
             localStorage.setItem('authUserPayload', JSON.stringify(user));
             setAuthState({
               user,
               isAuthenticated: true,
               isLoading: false
             });
          } else {
             setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          }
        }
      } catch (err) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    initializeAuth();

    // Listen to global logout events from interceptor
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('auth-expired', handleAuthExpired);

    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = (token: string, email: string, name?: string, provider: AuthProviderType = 'local') => {
    let finalEmail = email;
    let finalName = name || '';

    // Automatically inspect JWT payloads for missing identity data, heavily typical in pure-token OAuth redirects
    if (provider === 'google' && (!name || email === 'user@example.com' || email === 'user@google.com')) {
      const payload = parseJwt(token);
      if (payload) {
         if (payload.sub && payload.sub.includes('@')) finalEmail = payload.sub;
         if (payload.email) finalEmail = payload.email;
         if (payload.name) finalName = payload.name;
      }
    }

    finalName = finalName && finalName.trim().length > 0 ? finalName : finalEmail.split('@')[0];

    const userObj: User = {
      name: finalName,
      email: finalEmail,
      provider,
      initials: generateInitials(finalName !== finalEmail.split('@')[0] ? finalName : finalEmail)
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('authUserPayload', JSON.stringify(userObj));
    
    // For legacy compat during crossover
    localStorage.setItem('loggedInName', finalName);
    localStorage.setItem('loggedInUser', email);

    setAuthState({
      user: userObj,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUserPayload');
    localStorage.removeItem('loggedInName');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('user'); // old generic object

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
