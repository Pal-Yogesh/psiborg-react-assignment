import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount for persistent login
    const session = localStorage.getItem(STORAGE_KEY);
    if (session) {
      try {
        const { username, isLoggedIn: storedLoginStatus } = JSON.parse(session);
        if (storedLoginStatus) {
          setIsLoggedIn(true);
          setUser(username);
        }
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple static validation
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
      setUser(username);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        username, 
        isLoggedIn: true,
        timestamp: new Date().toISOString()
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
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
