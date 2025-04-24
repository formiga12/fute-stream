import React from 'react';
import { Navigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

  // Se não estiver autenticado e tentar acessar rota protegida, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={createPageUrl('AdminLogin')} replace />;
  }

  return children;
}