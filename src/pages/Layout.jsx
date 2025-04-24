
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, LayoutDashboard, Users, LogOut, Menu as MenuIcon, X, List } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  // Define which pages use admin layout
  const adminPages = ['AdminDashboard', 'ManageBanners', 'ManageCustomers'];
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
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">
                Streaming Plus
              </span>
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
                  title: "Gerenciar Transmissões",
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
          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
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
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <style jsx>{`
        ul {
          list-style: none;
          padding-left: 1.5em;
        }
        ul li {
          position: relative;
          padding-left: 1em;
        }
        ul li::before {
          content: "–";
          position: absolute;
          left: 0;
        }
      `}</style>
    </div>
  );
}
