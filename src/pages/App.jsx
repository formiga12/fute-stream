import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout';
import PrivateRoute from '../components/auth/PrivateRoute';

// Páginas públicas
import HomePage from './Home';
import WatchPage from './Watch';

// Páginas administrativas
import AdminLoginPage from './AdminLogin';
import AdminDashboardPage from './AdminDashboard';
import AdminPage from './Admin';
import ManageBannersPage from './ManageBanners';
import ManageCustomersPage from './ManageCustomers';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route 
          path="/" 
          element={
            <Layout currentPageName="Home">
              <HomePage />
            </Layout>
          } 
        />
        <Route 
          path="/watch" 
          element={
            <Layout currentPageName="Watch">
              <WatchPage />
            </Layout>
          } 
        />

        {/* Rota de Login */}
        <Route 
          path="/admin/login" 
          element={
            <Layout currentPageName="AdminLogin">
              <AdminLoginPage />
            </Layout>
          } 
        />

        {/* Rotas Protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout currentPageName="Admin">
                <AdminPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Layout currentPageName="AdminDashboard">
                <AdminDashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <PrivateRoute>
              <Layout currentPageName="ManageBanners">
                <ManageBannersPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateRoute>
              <Layout currentPageName="ManageCustomers">
                <ManageCustomersPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}