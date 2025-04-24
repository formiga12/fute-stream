import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout';

// Páginas públicas
import HomePage from './Home';
import WatchPage from './Watch';

export default function App() {
  return (
    <Router>
      <Routes>
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

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}