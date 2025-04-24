import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  useEffect(() => {
    async function checkAuth() {
      try {
        // First check for admin auth which doesn't require API calls
        if (isAdminAuthenticated) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Otherwise check user auth
        await User.me();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [isAdminAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={createPageUrl('Login')} replace />;
  }

  return children;
}