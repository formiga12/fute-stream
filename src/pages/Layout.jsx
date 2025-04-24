
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Home, 
  LayoutDashboard,
  FilePlus, 
  Users,
  LogOut,
  Menu as MenuIcon,
  X,
  List
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  
  // Define which pages use admin layout
  const adminPages = ['Admin', 'AdminDashboard', 'ManageBanners', 'ManageCustomers'];
  const isAdminPage = adminPages.includes(currentPageName);
  const isLoginPage = currentPageName === 'AdminLogin';
  const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';

  // Login page has no layout
  if (isLoginPage) {
    return children;
  }

  // Admin layout
  if (isAdmin && isAdminPage) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside 
          className={`
            fixed top-0 left-0 z-40 h-screen 
            ${isAdminSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            w-64 bg-white border-r border-gray-200 shadow-sm
          `}
        >
          {/* Logo */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">
                Streaming Plus
              </span>
              <button
                onClick={() => setIsAdminSidebarOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-4 flex flex-col h-[calc(100vh-140px)]">
            <nav className="flex-1 px-3 space-y-1">
              {[
                {
                  title: "Dashboard",
                  icon: <LayoutDashboard className="w-5 h-5" />,
                  path: "AdminDashboard",
                },
                {
                  title: "Criar Banner",
                  icon: <FilePlus className="w-5 h-5" />,
                  path: "Admin",
                },
                {
                  title: "Gerenciar Banners",
                  icon: <List className="w-5 h-5" />,
                  path: "ManageBanners",
                },
                {
                  title: "Clientes",
                  icon: <Users className="w-5 h-5" />,
                  path: "ManageCustomers",
                },
                {
                  title: "Site",
                  icon: <Home className="w-5 h-5" />,
                  path: "Home",
                }
              ].map((item) => {
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                      transition-colors duration-150 ease-in-out
                    `}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-3 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated');
                  window.location.href = createPageUrl("Home");
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150 ease-in-out"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 py-4 md:hidden">
              <button
                onClick={() => setIsAdminSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>

        {/* Mobile Backdrop */}
        {isAdminSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 md:hidden z-30"
            onClick={() => setIsAdminSidebarOpen(false)}
          />
        )}
      </div>
    );
  }

  // Public layout
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl("Home")} className="font-bold text-xl">
              Streaming Plus
            </Link>
            {isAdmin && (
              <Link 
                to={createPageUrl("AdminDashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                Área Administrativa
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
