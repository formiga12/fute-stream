import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout';

// Páginas públicas
import HomePage from './Home';
import WatchPage from './Watch';
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

        {/* Rotas Administrativas */}
        <Route 
          path="/admin/login" 
          element={
            <Layout currentPageName="AdminLogin">
              <AdminLoginPage />
            </Layout>
          } 
        />
        <Route
          path="/admin"
          element={
            <Layout currentPageName="Admin">
              <AdminPage />
            </Layout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Layout currentPageName="AdminDashboard">
              <AdminDashboardPage />
            </Layout>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <Layout currentPageName="ManageBanners">
              <ManageBannersPage />
            </Layout>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <Layout currentPageName="ManageCustomers">
              <ManageCustomersPage />
            </Layout>
          }
        />

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}