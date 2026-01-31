import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, Book, Home, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/todo', label: 'Tasks', icon: CheckSquare },
    { path: '/timer', label: 'Timer', icon: Clock },
    { path: '/diary', label: 'Diary', icon: Book },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                <CheckSquare className="w-6 h-6" />
                Taskify
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  // Only show protected routes if user is logged in
                  if (!user && (item.path === '/todo' || item.path === '/timer' || item.path === '/diary')) {
                    return null;
                  }

                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-l pl-6 border-gray-200">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile menu button (simple implementation) */}
            <div className="md:hidden flex items-center gap-4">
                 {user && (
                    <button onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                 )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
