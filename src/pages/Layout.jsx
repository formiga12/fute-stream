
import React from 'react';

export default function Layout({ children }) {
  // Remover qualquer verificação de autenticação do layout
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
